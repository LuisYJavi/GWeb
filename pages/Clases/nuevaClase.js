import React, { Component} from 'react';
import Layout from '../../components/Layout';
import { Button, Checkbox, Form, Input, Message, Columns } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import {convDNI, convVuelo, convNomYapellido, convNomYapellidoAtras} from '../../transformers'


class nuevaClase extends Component{
 
  componentDidMount() {
    console.log(this);
}

 state = {
   nombre: '',
   apellido1:'',
   apellido2:'',
   dni:'',
   vuelo: '',
   importe: '',
   MensajeError:'',
   loading: false
   
 };



 onSubmit = async (event) => {
    event.preventDefault();
     
    this.setState({loading:true, MensajeError:''});
    
try{

    const accounts = await web3.eth.getAccounts();
    const importeV = this.state.importe;

    const vueloInt = convVuelo(this.state.vuelo);
    const dniInt = convDNI(this.state.dni);
    const nomYapellido = convNomYapellido(this.state.nombre,this.state.apellido1,
      this.state.apellido2);
      
     
      

    await factory.methods.crearSeguro(vueloInt, nomYapellido,dniInt, importeV)
    .send({
      from: accounts[0]
    });
    
    Router.pushRoute('/');

    }catch (err) {

    this.setState({MensajeError: err.message});

  } 

  this.setState({loading :false});
 };



  render(){
    return(
      <Layout>
        <h1 style={{ fontSize: "large" }}>Nuevo Seguro</h1>

        <Form onSubmit = { this.onSubmit } error={!!this.state.MensajeError}>
    
          <Form.Group widths='equal'>
   
            <Form.Field floated = "right">
              <label>Nombre Asegurado</label>
              <Input
              placeholder='Nombre Asegurado' 
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
                <label>Vuelo a Asegurar</label>
                <Input 
                  placeholder='Vuelo a Asegurar'
                  value = {this.state.vuelo}
                onChange = {event => this.setState({ vuelo: event.target.value })}
                />
              </Form.Field>  
      
              <Form.Field>
                <label>Día del vuelo</label>
                <Input 
                  placeholder='dd/mm/yyyy'
                  //value = {this.state.vuelo}
                  //onChange = {event => this.setState({ vuelo: event.target.value })}
                />
              </Form.Field>  
        
              <Form.Field>
                <label>Hora del vuelo</label>
                <Input 
                  placeholder='hh:mm'
                //value = {this.state.vuelo}
                //onChange = {event => this.setState({ vuelo: event.target.value })}
                />
              </Form.Field>  


            </Form.Group>   



              <Form.Field>
                <label>Importe del Vuelo</label>
                <Input 
                  placeholder='Importe en Euros del Vuelo'
                  value = {this.state.importe}
                  onChange = {event => this.setState({ importe: event.target.value })}
                />
              </Form.Field>  


              <Form.Field>
                <Checkbox label='Estoy de acuerdo con los términos y condiciones del servicio' />
              </Form.Field>

              <Form.Field>
                <Checkbox label='Tengo el billete del que solicito el seguro' />
              </Form.Field>

      <Message error header="Lo sentimos hay un error:!" content = {this.state.MensajeError}/>
      <Button loading={this.state.loading} primary type='submit'>Asegurame</Button>

    </Form>
    
  </Layout>
    )
  }
};

    export default SeguroNuevo

 
 