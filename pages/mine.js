import React, {Component} from 'react';
import { Card, Button, Form, Icon, Input, Message, Grid } from 'semantic-ui-react'
import factory from '../ethereum/lectorContratos/factory';
import Layout from '../components/Layout';
import {Router, Link} from '../routes';
import {convNomYapellidoAtras,convVueloAtras,convDNI} from '../transformers';

class MiInfo extends Component {
    
    state = {
        dnI: '',
        errorMessage: '',
        loading: false,
        vuelo:'',
        miVuelo: [],
        datosDeCliente: new Object(),
        nombreTransformado: ""
    };

    
    renderInsurances() {
        const items = this.state.miVuelo.map(string => {
            return {
                header: string,
                description: 'View Insurance',
                fluid: true            
            };
        });

        return <Card.Group items={items} />;
    }

    
    conversorVuelo(numeroVuelo){
        const vuelo = convVueloAtras(numeroVuelo);
        return vuelo;
      }

        


    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {

            
            const dniInt = convDNI(this.state.dnI);        
                        
            const indexCliente = await factory.methods.dniExisteCliente(dniInt).call();
            const miSeguro = await factory.methods.getVueloCliente(indexCliente).call();
            const datosCliente = await factory.methods.customers(indexCliente).call();
            
            console.log(miSeguro);//Aqui todavia es array
            
            const todosMisVuelos = []; 

            for (var i = 0; i < miSeguro.length; i++){
                const numVuelo = this.conversorVuelo(miSeguro[i]);
                todosMisVuelos.push(numVuelo)
                }

            //console.log(datosCliente);

            console.log(todosMisVuelos);

            const nombreTrans= convNomYapellidoAtras(datosCliente.nombre);  
            console.log(nombreTrans);

            this.setState({ miVuelo: todosMisVuelos, datosDeCliente: datosCliente,nombreTransformado: nombreTrans});//

            //Router.pushRoute('/mine');

        } catch (err){
            this.setState({ errorMessage: err.message});
        }

        this.setState({ loading: false });

    };
    
    
    render(){

        console.log(this.state.datosDeCliente);
  
        return (
            <Layout>
                <h3>Sección Usuario</h3>
                    <Grid >
                        <Grid.Row>
                        <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                            <Form.Field>
                                <label>Enter your DNI</label>

                                <Input 
                                    placeholder='00000000-X'

                                    value = {this.state.dnI}
                                    onChange = {event =>
                                    this.setState({ dnI: event.target.value})}
                                />
                            </Form.Field>

                            <Button 
                                primary
                                type='submit' 
                                loading={this.state.loading}>
                                ¡Buscar mis Seguros!
                            </Button>
                            
                            <Message
                                error
                                header='Oooops'
                                content={this.state.errorMessage}
                            />
                        </Form>
                        </Grid.Row>


                        <Grid.Row columns={2}>  
                            <Grid.Column>
                                {this.state.nombreTransformado[0]} {this.state.nombreTransformado[1]} {this.state.nombreTransformado[2]} 
                            </Grid.Column>
                            
                            <Grid.Column>
                                {this.state.datosDeCliente.precioVuelo}
                            </Grid.Column>
                        </Grid.Row> 


                        <Grid.Row >  
                        {this.renderInsurances() } 
                        </Grid.Row> 
                    </Grid>
            </Layout>
        );   
    }
}


export default MiInfo;
  