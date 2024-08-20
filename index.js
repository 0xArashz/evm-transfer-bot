const fs = require("fs");
const { Web3 } = require("web3");
require("dotenv").config();


const rpcURL = process.env.RPC_URL;
const web3 = new Web3(rpcURL);
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
const recipients = JSON.parse(
    fs.readFileSync("./recipients.json", "UTF-8")
);

const getRandomAmount = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(8);
};

const getRandomDelay = () => {
    return Math.floor(Math.random() * 6 + 10) * 1000;
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let txCount = 0;
const sendTransaction = async () => {
    try {
        for (let recipient of recipients) {
            const amount = getRandomAmount(0.00001, 0.0001);
            const txData = {
                from: web3.eth.defaultAccount,
                to: recipient,
                value: web3.utils.toWei(amount, "ether"),
                gas: 21000,
                gasPrice: web3.utils.toWei("1", "gwei"),
                chainId: process.env.CHAIN_ID
            };
            await web3.eth.sendTransaction(txData);
            txCount++;
            console.log(
                "\x1b[32m%s\x1b[0m",
                `--> #${txCount < 10 ? "0" + txCount : txCount} TRANSFER ${amount} COIN TO ${recipient} DONE \u2705`
            );
            if (txCount !== recipients.length) {
                const interval = getRandomDelay();
                await sleep(interval);
            } else {
                console.log("\n");
                process.exit();
            }
        }
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", `ERROR: ${error.message}`);
    }
};

process.stdout.write("\x1Bc");
console.log("\x1b[32m%s\x1b[0m", "##################################################");
console.log("\x1b[32m%s\x1b[0m", "#                                                #");
console.log("\x1b[32m%s\x1b[0m", "#             DEVELOPER: 0xArashz                #");
console.log("\x1b[32m%s\x1b[0m", "#     GITHUB: https://github.com/0xArashz        #");
console.log("\x1b[32m%s\x1b[0m", "#                                                #");
console.log("\x1b[32m%s\x1b[0m", "##################################################\n\n");
sendTransaction();