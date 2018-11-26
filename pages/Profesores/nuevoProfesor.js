import React, { Component} from 'react';
import Layout from '../../components/Layout';
import { Button, Checkbox, Form, Input, Message, Columns } from 'semantic-ui-react';
import factory from '../../ethereum/lectorContratos/factory';
import profesor from '../../ethereum/lectorContratos/profesoresContrato';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import {convStringABytes32} from '../../transformers'


class NuevoProfesor extends Component{
 
  componentDidMount() {
    console.log(this);
  }

  state = {
    nombre: '',
    apellido1:'',
    apellido2:'',
    dirEthereum:'',
    MensajeError:'',
    loading: false
    
  };

  onSubmit = async (event) => {
      event.preventDefault();
      this.setState({loading:true, MensajeError:''});
      
  try{

      const accounts = await web3.eth.getAccounts();
      const nomYapellido = convStringABytes32(`${this.state.nombre}%%%${this.state.apellido1}%%%${this.state.apellido2}`);
      
      console.log(nomYapellido);
      const dirTipos = await factory.methods.verDireccionesMaestras().call();
      console.log(dirTipos);
      const correcto = await profesor(dirTipos[2]).methods.creaNuevoProfesor(this.state.dirEthereum, nomYapellido)
      .send({
        from: accounts[0],
        gas: 100000
      
      });
     console.log(correcto);

    Router.pushRoute('/');

    }catch (err) {

    this.setState({MensajeError: err.message});

  } 

  this.setState({loading :false});
 };



  render(){
    return(
      <Layout>
        <h1 style={{ fontSize: "large" }}>Nuevo Profesor</h1>

        <Form onSubmit = { this.onSubmit } error={!!this.state.MensajeError}>
    
          <Form.Group widths='equal'>
   
            <Form.Field floated = "right">
              <label>Nombre</label>
              <Input
              placeholder='Nombre' 
              value = {this.state.nombre}
              onChange = {event => this.setState({nombre: event.target.value})}
              />
            </Form.Field>

            <Form.Field >
            <label >Primer Apellido</label>
              <Input 
              placeholder='Primer Apellido'
              value = {this.state.apellido1}
              onChange = {event => this.setState({apellido1: event.target.value})}
              />
            </Form.Field>


            <Form.Field >
              <label >Segundo Apellido</label>
              <Input 
              placeholder='Segundo Apellido'
              value = {this.state.apellido2}
              onChange = {event => this.setState({apellido2: event.target.value})}
              />
            </Form.Field>
    
    
          </Form.Group>

            <Form.Field width={5}>
              <label>DNI/NIF</label>
              <Input
                placeholder='00000000-A' 
                value = {this.state.dni}
                onChange = {event => this.setState({dni: event.target.value})}
              />
            </Form.Field>


            <Form.Group widths='equal'>
              <Form.Field>
                <label>Direccion de Ethereum</label>
                <Input 
                  placeholder='Direccion de ethereum'
                  value = {this.state.dirEthereum}
                onChange = {event => this.setState({ dirEthereum: event.target.value })}
                />
              </Form.Field>  
            </Form.Group>   

              <Form.Field>
                <Checkbox label='Genial!! Dame de alta en vuestra App' />
              </Form.Field>

              <Form.Field>
                <Checkbox label='Consiento que mis datos... bla bla bla' />
              </Form.Field>

      <Message error header="Lo sentimos hay un error:!" content = {this.state.MensajeError}/>
      <Button loading={this.state.loading} primary type='submit'>Vamos a Ello!!!</Button>

    </Form>
    
  </Layout>
    )
  }
}

    export default NuevoProfesor

 
 