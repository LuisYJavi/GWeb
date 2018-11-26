import Web3 from "web3";
const HDWalletProvider = require("truffle-hdwallet-provider");

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);

} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new HDWalletProvider(
    "author clarify kid calm fetch imitate kitten cheese wonder coconut zone health",
    "https://rinkeby.infura.io/v3/0fe2caab2f9442e6898ed7d1e2542588"
  );

  web3 = new Web3(provider);
}
console.log(web3);
export default web3;
