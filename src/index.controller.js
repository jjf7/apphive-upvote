const io = require("./index");
const { Client, PrivateKey } = require("@hiveio/dhive");
const DB = require("./database");

const { weight } = require("./config");

const indexController = (req, res) => {
  async function getUSer(DB, author) {
    return await DB.find((i) => i.tag === author);
  }

  try {
    const client = new Client("https://api.hive.blog");
    let stream;

    const privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

    io.on("connection", (socket) => {

      console.log(socket.id)
      stream = client.blockchain.getOperationsStream();

      stream
        .on("data", async function (block) {
          const op = block.op[0];

          if (op === "comment") {
            const parent_author = block.op[1].parent_author.toString();
            const author = block.op[1].author.toString();

            console.log(parent_author, author);

            const findUser = await getUSer(DB, author);

            if (findUser) {
              let data;
              if (!block.op[1].parent_author) {
                data = {
                  tag: findUser.tag,
                  parentUser: "",
                };

                console.log(block);
                console.log("data:", data);

                //create vote object
                const vote = {
                  voter: process.env.VOTER,
                  author: findUser.tag,
                  permlink: block.op[1].permlink,
                  weight,
                };

                console.log("vote: ", vote);

                const result = await client.broadcast.vote(vote, privateKey);
                console.log("success:", result);

                data.result = `Vote Tx ID: <span>${result.id}</span>`;

                socket.emit("block", data);
              } else {
                data = {
                  tag: findUser.tag,
                  parentUser: block.op[1].parent_author,
                };
              }
            }
          }
        })
        .on("end", function () {
          // done
          console.log("END");
        });

      socket.on("events", (action) => {
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
