const { Client, PrivateKey } = require("@hiveio/dhive");
const { weight, repLog10, upvote_reputation } = require("./config");

const upvotes = async () => {
 
  let stream;
  try {
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

            const obj = [author];

            const acc = await client.database.call("get_accounts", [obj]);

            const reputation = repLog10(acc[0].reputation);

            if (reputation > upvote_reputation) {
             
              const vote = {
                voter: process.env.VOTER,
                author,
                permlink: block.op[1].permlink,
                weight,
              };
              const result = await client.broadcast.vote(vote, privateKey);
              console.log(`Vote success to ${author}[${reputation}] with Id tx: ${result.id}`);
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
  } catch (error) {
    console.log(`error first try = ${error.message}`);
  }
};

module.exports = upvotes;
