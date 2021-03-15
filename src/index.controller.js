const server = require("./index");
const { Client, PrivateKey } = require("@hiveio/dhive");
const DB = require("./database");
const io = require("socket.io")(server);
const { weight } = require("./config");

const indexController = (req, res) => {
  async function getUSer(DB, author) {
    return await DB.find((i) => i.tag === author);
  }

  try {
    const client = new Client("https://api.hive.blog");
    let stream;

    const privateKey = PrivateKey.fromString(
      process.env.PRIVATE_KEY
    );

    io.on("connection", (newSocket) => {
      stream = client.blockchain.getOperationsStream();

      stream
        .on("data", async function (block) {
          const op = block.op[0];

          if (op === "comment") {
            const parent_author = block.op[1].parent_author.toString();
            const author = block.op[1].author.toString();

            console.log(parent_author, author);

            //const findUser = DB.find((i) => i.tag === author );
           // const findUser = await getUSer(DB, author);

            
              let data;
              if (!block.op[1].parent_author) {
                data = {
                  tag: author,
                  parentUser: "",
                };

                console.log(block);
                console.log("data:", data);

                //create vote object
                const vote = {
                  voter: process.env.VOTER,
                  author,
                  permlink: block.op[1].permlink,
                  weight,
                };

                console.log("vote: ", vote);

               

                const result = await client.broadcast.vote(vote, privateKey);
                console.log("success:", result);

                data.result = `Vote Tx ID: <span>${result.id}</span>`;

                newSocket.emit("block", data);
              } else {
                data = {
                  tag: author,
                  parentUser: block.op[1].parent_author,
                };
              }
             
          }
        })
        .on("end", function () {
          // done
          console.log("END");
        });

      newSocket.on("events", (action) => {
        if (action) {
          console.log("Resume");
          stream.resume();
        } else {
          console.log("Pause");
          stream.pause();
        }
      });
    });

    res.render("home");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = indexController;
