import React, { Component} from 'react';
import Layout from '../../components/Layout';
import { Button, Grid, Form, Input, Message, Image} from 'semantic-ui-react';
import tiposClases from '../../ethereum/lectorContratos/tiposContrato';
import factory from '../../ethereum/lectorContratos/factory';
import web3 from '../../ethereum/web3';
import {convStringABytes32} from '../../transformers'

class NuevoTipoClase extends Component{

componentDidMount() {
}
  state = {
    nombreClase: '',
    duracionClase:'',
    costeClase:'',
    loading: false,
    MensajeError:''
    };
   

onSubmit = async (event) => {
  event.preventDefault();
  this.setState({loading:true, MensajeError:''});
    
  try{
      
      
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const dirTipos = await factory.methods.verDireccionesMaestras().call();
    console.log(dirTipos);
    const nombreClaseByte = convStringABytes32(this.state.nombreClase);
    await tiposClases(dirTipos[0]).methods.creaNuevoTipo(nombreClaseByte ,this.state.duracionClase, this.state.costeClase)
    .send({
      from: accounts[0],
      gas: 130000
    });
      
      } catch(err) {

      this.setState({MensajeError: err.message});

    } 

    this.setState({loading :false});
  };

render(){
    return(
      <Layout>
        <h1 style={{ fontSize: "large" }}>Nuevo Tipo de Clase</h1>
        
        
        <Form onSubmit = { this.onSubmit } error={!!this.state.MensajeError}>
    
        <Grid columns={2} divided> 

          <Grid.Column width={10}> 
            <Form.Field >
            <label >Nombre de clase</label>
              <Input 
              placeholder='Yoga, Running, Meditación...'
              value = {this.state.nombreClase}
              onChange = {event => this.setState({nombreClase: event.target.value})}
              />
            </Form.Field>
     
              <Form.Field width={5}>
              <label>Duracion de la Clase</label>
              <Input
                placeholder='En segundos ***modificar***' 
                value = {this.state.duracionClase}
                onChange = {event => this.setState({duracionClase: event.target.value})}
              />
              </Form.Field>


              <Form.Field>
                <label>Coste en Gymes></label>
                <Input 
                  placeholder='Coste en Gyms: 1 o 2'
                  value = {this.state.costeClase}
                onChange = {event => this.setState({ costeClase: event.target.value })}
                />
              </Form.Field>  
             

           

        <Message error header="Lo sentimos hay un error:!" content = {this.state.MensajeError}/>
        <Button loading={this.state.loading} primary type='submit'>Vamos a Ello!!!</Button>
        </Grid.Column> 

        <Grid.Column width={5}>
        <Image src =  "/static/Tipo1.jpg" size='small'/>
        
        </Grid.Column>

      </Grid>    
    </Form>
    
  </Layout>
    )
  }
};

export default NuevoTipoClase
