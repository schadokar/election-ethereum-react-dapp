const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

const compile = () => {
    const buildPath = path.resolve("./build");
    fs.removeSync(buildPath);

    const contractPath = path.resolve("./contracts","election.sol");
    const source = fs.readFileSync(contractPath, "utf8");
    const output = solc.compile(source, 1).contracts;

    fs.ensureDirSync(buildPath);

    for(let contract in output) {
        fs.outputJSONSync(
            path.resolve(buildPath, contract.replace(":","")+".json"),
            output[contract]
        );
    }
};

compile();
module.exports = compile;