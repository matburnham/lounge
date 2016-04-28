global.log = require("../log.js");

var program = require("commander");
var pkg = require("../../package.json");
var fs = require("fs");
var mkdirp = require("mkdirp");
var Helper = require("../helper");

program.version(pkg.version, "-v, --version");
program.option("");
program.option("    --home <path>" , "home path");

var argv = program.parseOptions(process.argv);
if (program.home) {
	Helper.HOME = program.home;
}

var config = Helper.HOME + "/config.js";
if (!fs.existsSync(config)) {
	mkdirp.sync(Helper.HOME, {mode: "0700"});
	fs.writeFileSync(
		config,
		fs.readFileSync(__dirname + "/../../defaults/config.js")
	);
	log.info("Config created:", config);
}

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");
require("./reset");
require("./edit");

program.parse(argv.args);

if (!program.args.length) {
	program.parse(process.argv.concat("start"));
}
