const fs = require("fs-extra");
const path = require("path");
const { web3, web3Network } = require("./web3");
// const jsonfile = require('jsonfile');
const circularJSON = require("circular-json");

const deploy = async () => {
  try {
    let receiptPath;
    if (web3Network == "ganache") {
      receiptPath = path.resolve(
        "ethereum",
        "receipt-" + web3Network + ".json"
      );
      console.log("---------- receipt path --------", receiptPath);
    } else if (web3Network == "rinkeby") {
      receiptPath = path.resolve(
        "ethereum",
        "receipt-" + web3Network + ".json"
      );
      console.log("---------- receipt path --------", receiptPath);
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const compiledContract = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "build", "ElectionFactory.json"),
        "utf8"
      )
    );
    const result = await new web3.eth.Contract(
      JSON.parse(compiledContract.interface)
    )
      .deploy({
        data: compiledContract.bytecode,
      })
      .send({ gas: 4050000, from: accounts[0] });

    console.log("Contract deployed to ", result.options.address);

    const serialised = circularJSON.stringify(result.options);
    fs.writeJsonSync(receiptPath, result.options);
    //.writeFileSync(receiptPath, result.options);
    console.log("receipt saved successfully");
    return await serialised;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// deploy(5);
module.exports = deploy;
