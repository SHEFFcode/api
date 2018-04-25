const pjson = require('../package.json');
const colors = require("colors");
const argv = require('yargs').argv;

if (argv.dev || process.env.NODE_ENV === 'test') {
  pjson.setts.forceDev = true;
}

// Dev override
if (pjson.setts.forceDev) {
  console.log("[ENVIRON]".yellow, "DEV".red);
}

module.exports = pjson;