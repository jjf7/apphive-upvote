//const io = require("./index");
const { Client, PrivateKey } = require("@hiveio/dhive");
const DB = require("./database");
const { weight, repLog10, upvote_reputation } = require("./config");

const upvotes =  () => {
  // async function getUSer(DB, author) {
  // return await DB.find((i) => i.tag === author);
  //}

  let stream;
  const client = new Client("https://api.hive.blog");
  const privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

  console.log("Starting stream ...");
  stream = client.blockchain.getOperationsStream();

  stream.on("data", async (block) => {
      try {
        const op = block.op[0];

        if (op === "comment") {
          if (!block.op[1].parent_author) {
            const author = block.op[1].author.toString();

            // console.log(author);
            const obj = [author];

            const acc = await client.database.call("get_accounts", [obj]);

            const reputation = repLog10(acc[0].reputation);

            if (reputation > upvote_reputation) {
              console.log(`Reputation of ${author} = ${reputation}`);
              //create vote object
              const vote = {
                voter: process.env.VOTER,
                author: author,
                permlink: block.op[1].permlink,
                weight,
              };

              // console.log("vote: ", vote);
              const result = await client.broadcast.vote(vote, privateKey);
              console.log("Vote success ID: ", result.id);
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    })
    .on("end", function () {
      // done
      console.log("END");
    });
};

module.exports = upvotes;
