/*eslint linebreak-style: ["error", "windows"]*/
import web3 from "../web3";
import alumnosC from "../build/alumnosContrato.json";
export default address => {
  return new web3.eth.Contract(
    JSON.parse(alumnosC.interface), address
  );
};