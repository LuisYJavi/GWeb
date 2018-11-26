import web3 from './web3';
import Insurace from './build/Clase.json';

export default address => {

 return new web3.eth.Contract(
   JSON.parse(Insurace.interface), address
   );
  
};
