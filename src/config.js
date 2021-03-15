const PORT = process.env.PORT || 5000;

let opts = {};
//connect to production server
opts.addressPrefix = "STM";
opts.chainId =
  "beeab0de00000000000000000000000000000000000000000000000000000000";

const weight = 5000;

module.exports = { opts, PORT, weight };
