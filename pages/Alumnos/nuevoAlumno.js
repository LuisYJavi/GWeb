import React, { Component} from 'react';
import Layout from '../../components/Layout';
import { Button, Checkbox, Form, Input, Message, Grid, GridRow, GridColumn } from 'semantic-ui-react';
import factory from '../../ethereum/lectorContratos/factory';
import alumnos from '../../ethereum/lectorContratos/alumnosContrato';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import {convStringABytes32} from '../../transformers'



class NuevoAlumno extends Component{
 
  componentDidMount() {
    console.log(this);
}

  state = {
    nombre: '',
    apellido1:'',
    apellido2:'',
    tfn:"",
    MensajeError:'',
    chequeado:false,
    chequeado2:false,
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
            //const nombreYrating = 0;        
    await alumnos(dirTipos[1]).methods.creaNuevoAlumno(this.state.tfn, nomYapellido)
    .send({
      from: accounts[0],
      gas: 100000
    });
    
    
    }catch (err) {

    this.setState({MensajeError: err.message});

  } 

  this.setState({loading :false});
 };



  render(){
    return(
      <Layout>
        <h1 style={{ fontSize: "large" }}>Rellena los datos indicados!!</h1>
        
          
        
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
         
            <Form.Field >
              <label>DNI/NIF</label>
              <div className="inline field">
              <Input
                placeholder='00000000-A' 
                value = {this.state.dni}
                onChange = {event => this.setState({dni: event.target.value})}
              />
              <div class="ui left pointing red basic label">
                Nos tomamos muy en serio la privacidad de nuestros usuarios. Cualquier duda clca en "Saber más... BlockChain que es eso?"
                </div>
                </div>
            </Form.Field>

            <Form.Field  >
              <label>Teléfono</label>
              <div class="inline field">
                 <Input 
                  
                  placeholder='699699699' 
                  value = {this.state.tfn}
                  onChange = {event => this.setState({tfn: event.target.value})}/> 
                  <div class="ui left pointing red basic label">
                  No te preocupes no recibiras ninguna llamada más que del profesor por si hubiese retrasos!
                  </div>
              </div>
            </Form.Field>


              <Form.Field>
                <Checkbox label='Genial!! Dame de alta en vuestra App'
                value = {this.state.chequeado}
                onChange = {event => this.setState({chequeado: event.target.value})}/>
              </Form.Field>

              <Form.Field>
                <Checkbox label='Consiento que mis datos... bla bla bla' 
                value = {this.state.chequeado2}
                onChange = {event => this.setState({chequeado2: event.target.value})}/> 
                <div class="ui left pointing red basic label">
                Total... no lo vas a leer...
                </div>
              </Form.Field>

        <Message error header="Lo sentimos hay un error:!" content = {this.state.MensajeError}/>
        <Button size='big' loading={this.state.loading} primary type='submit'>Apuntame!!!</Button>
        
     </Form>
     <Form>
          <Button color='red' floated='right' size='big' loading={this.state.loading} type='submit'>Saber más... BlockChain que es eso?!!!</Button>
    </Form>

  </Layout>
    )
  }
};

    export default NuevoAlumno