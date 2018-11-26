/*eslint linebreak-style: ["error", "windows"]*/
import web3 from '../web3';
import fabricadorClases from '../build/FabricadorClases' ;

const instancia = new web3.eth.Contract(
	JSON.parse(fabricadorClases.interface),
	'0xc56af75580E1fb466a07451B318E3340b0710887'
);

export default instancia;