const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  // In ethers, contract factory is just an object that can be used to deploy contracts
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
    // console.log(contract);
  const deployReceipt = await contract.deploymentTransaction().wait(1);
  //   console.log("Here is the deployment transaction:");
  //   console.log(contract.deployTransaction);
  //   console.log("Here is the txn receipt:");
  //   console.log(deployReceipt);
  console.log(`Contract deployed to ${contract.target}`);

//   const nonce = await wallet.getTransactionCount();

  let currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
  console.log("Updating favorite number...");
  let transactionResponse = await contract.store("7");
  let transactionReceipt = await transactionResponse.wait(1);
  currentFavoriteNumber = await contract.retrieve();
  console.log(`New Favorite Number: ${currentFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
