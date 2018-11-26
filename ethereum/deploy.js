const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const creadorClases = require("./build/FabricadorClases.json");

const provider = new HDWalletProvider(
  "author clarify kid calm fetch imitate kitten cheese wonder coconut zone health",
  "https://rinkeby.infura.io/v3/0fe2caab2f9442e6898ed7d1e2542588"

);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Checking account???", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(creadorClases.interface)
  )
    .deploy({ data: creadorClases.bytecode, arguments: [1000] })
    .send({
      gas: 5000000,
      from: accounts[0]
    });

  //console.log(interface);
  console.log("mi direccion es: ", result.options.address);
  console.log("el gas usado fue: ", result.options.gasPrice);
};
deploy();