import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Insurance from '../../ethereum/seguros';
import {Card, Grid, Button} from 'semantic-ui-react'
import { Link } from '../../routes';

class VerSeguros extends Component {

  static async getInitialProps(props){
    const seguros = Insurance(props.query.address);
    const numVuelo = await seguros.methods.vueloDir().call();
    const numClientes = await seguros.methods.numeroClientes().call();
          
     

    return{
        address: props.query.address,
        numeroVuelo: numVuelo,
        clientes: numClientes
        
        
     };
     
   }
  
  conversorVuelo(){
    console.log(this.props.direccion)
    const numeroVueloDigitos = this.props.numeroVuelo;
    const long = numeroVueloDigitos.length;
    if (long == 9) {
             
      var vueloDig1 = String.fromCharCode(numeroVueloDigitos.substring(0,1));
      var vueloDig2 = String.fromCharCode(numeroVueloDigitos.substring(2,5));
      var vueloDig3 = numeroVueloDigitos.substring(5,9);
    } {
      var vueloDig1 = String.fromCharCode(numeroVueloDigitos.substring(0,2));
      var vueloDig2 = String.fromCharCode(numeroVueloDigitos.substring(3,5));
      var vueloDig3 = numeroVueloDigitos.substring(5,9);
    };

    var vuelo = vueloDig1 + vueloDig2 + vueloDig3;
    return vuelo;
  }

  renderCards(){ 
    
      const items = [
        {
          header: "Asegurado",
          meta: this.props.clientes,
          description: "Actualmente bajo este vuelo este es el núemrod e personas aseguradas" 

        },

      
    ];

    return <Card.Group items={items} />;
  
  }

    render(){
     return(  
     <Layout>

        <h3>Seguro del Vuelo: {this.conversorVuelo()}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
            <Link route={`https://rinkeby.etherscan.io/address/${this.props.address}`}>
              <a>test</a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
     </Layout>
     )}
 }

export default VerSeguros;