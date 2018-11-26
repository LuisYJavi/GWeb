import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react'
import factory from '../ethereum/lectorContratos/factory'
import Layout from '../components/Layout';
import {Link} from '../routes';

const URL = require('url');

class indiceDeClases extends Component {
  static async getInitialProps() {
    const clases = await factory.methods.verAddrClasesCreadas().call();
    
    return { clases };
   }

renderClases() {
  const items = this.props.clases.map(address => {
    
   
    return{
      
      header: ("Direccion de ethereum:" + address),
      description: ( 
        <content>
        <div> <Link route = {`/clases/${address}`}>
        <a>Vea la clase en nuestra página</a>
        </Link></div>     
                      
        <div><Link route = {`https://rinkeby.etherscan.io/address/${address}`}>
        <a>Ver en etherScan : {address}</a>
        </Link></div> 

        <div> text </div>    
        </content>    
        ),

      fluid: true,
     
    };

  });

  return <Card.Group  itemsPerRow={2} items = {items} />
}


render(){
  
  return (
  <Layout>
    <div>
  
    
    <h3 style={{  fontSize: "medium" }}>Bienvenido a Gyms!!!</h3>
      
    <Link route="/clases/nueva">
      <a>
      <Button
        floated = "right"
        content= "Crear una clase!!"
        icon = "add circle"
        primary 
        />
      </a>
    </Link>

     <Link route="/clases/nuevoProfesor">
      <a>
      <Button
        floated = "right"
        content= "Eres Profe?? Unete y da clases donde quieras y cuando quieras!!!"
        icon = "add circle"
        primary 
        />
      </a>
    </Link> 




    <div style={{  fontSize: "x-small" }}>{this.renderClases()}</div>

    </div>
</Layout>
  );
}

}
export default indiceDeClases;

