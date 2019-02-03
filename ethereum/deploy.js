const fs = require("fs-extra");
const path = require("path");
const {web3, web3Network} = require("./web3");
const compiledContract = require("./build/Election.json");
const jsonfile = require('jsonfile');

const deploy = async () => {
    let receiptPath;
    if (web3Network == "ganache") {
        receiptPath = path.resolve("receipt-"+web3Network+".json");
        console.log("---------- receipt path --------", receiptPath);
    }
    else if (web3Network == "rinkeby") {
        receiptPath = path.resolve("receipt-"+web3Network+".json");
        console.log("---------- receipt path --------", receiptPath);
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account" , accounts[0]);

    if(fs.existsSync(receiptPath)){
        fs.removeSync(receiptPath);
        console.log("receipt file deleted");    
        fs.ensureFileSync(receiptPath);
        console.log("receipt file created");
    }
    else {
        fs.ensureFileSync(receiptPath);
        console.log("receipt file created");
    }

    const result = await new web3.eth.Contract(
        JSON.parse(compiledContract.interface)
    )
    .deploy({data: compiledContract.bytecode})
    .send({gas: 3000000, from: accounts[0]});

    console.log("Contract deployed to ", result.options.address);

    jsonfile.writeFileSync(receiptPath, result.options);
    console.log("receipt saved successfully");
    return await result;
}

// deploy();
module.exports = deploy();