import React, {Component} from 'react';
import { Form, Grid, Card, Button, Image, Input, Message, Icon } from 'semantic-ui-react'
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/lectorContratos/factory';
import alumnos from '../../ethereum/lectorContratos/alumnosContrato';
import Layout from '../../components/Layout';
import {Link} from '../../routes';
import {Bytes32AString} from '../../transformers';

class MiInfoProfe extends Component {
    
  state = {
      Id: '',
      errorMessage: '',
      loading: false,
      gymsActuales:'',
      rating: [],
      numClases: 0,
      nombre: ""
  };

  
    onSubmit = async (event) => {
        event.preventDefault();
        console.log(this.state.Id);
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            console.log(this.state.Id);
            const dirTipos = await factory.methods.verDireccionesMaestras().call();   
            //const nombreYrating = 0;            
            const nombreYgyms = await alumnos(dirTipos[1]).methods.verInfoAlumno(this.state.Id).call(
                {from: accounts[0]});
            //const GymsActuales = await factory.methods.checkGananciasProfesor(this.state.address).call();
            console.log(nombreYgyms);
            const nombreTrans = Bytes32AString(nombreYgyms[0]);

            console.log(nombreTrans);
            
                                
            this.setState({ nombre: nombreTrans, gymsActuales: nombreYgyms[1],  });//
            
            
        } catch (err){
            this.setState({ errorMessage: err.message});
        }

            this.setState({ loading: false });

    };
  
  

  
  render(){
  
      return (
          <Layout>
              <h1 style={{  fontSize: "xx-large" }}>Hola de Nuevo!!!!</h1>
                  <Grid >
                      <Grid.Row columns={2}>
                        <Grid.Column width={10}>
                            <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                                <Form.Field  >
                                    <label style={{  fontSize: "large" }}>Mi Nº de Telefono!</label>
                                   
                                    <Input 
                                        placeholder='000000000'
                                        
                                        value = {this.state.Id}
                                        onChange = {event =>
                                        this.setState({ Id: event.target.value})}
                                        
                                    />
                                    <div class="ui pointing label">
                                       Cambiarlo para que traiga el user y contraseña del login de google/fb/correo etc
                                    </div>

                                </Form.Field>
                             
                                <Button size='large'
                                primary
                                type='submit' 
                                loading={this.state.loading}>
                                ¡Mis Datos!
                                </Button>
                                
                                <Button size='large' color='red'  type='submit'  loading={this.state.loading}>
                                    <Link route="/Profesores/nuevoProfesor">
                                    <div> Quiero más Gyms!!! Me gusta estar Sano y Saludable!!       </div>
                                    </Link>  
                                </Button>     
                                <br/><br/>   

                                <Form size='small'>
                                <label > <div>Recuerda que ademas de meter tu direccion de Ethereum tienes que estar
                                    registrado en Metamsk y tener la cuenta activa. Tranquilo esto no consume ehers ni
                                    dinero y es totalmente GRATIS!
                                    </div>
                                    <div> <br/>
                                    Aunque es incomodo lo hacemos para darte la seguridad que solo la BlockChain ofrece!!!
                                    </div>
                                </label>           

                                </Form>     
                                              



                                <Message
                                error
                                header='Oooops'
                                content={this.state.errorMessage}
                                />
                            </Form>
                        </Grid.Column>

                        <Grid.Column width={6}>      
                            <Card color='red'>
                            <Image  src =  "/static/Profesor.jpg"/>
                                <Card.Content>
                                <Card.Header>Nombre: {this.state.nombre}</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Tu rating actual es: {this.state.rating}</span>
                                    </Card.Meta>
                                    <Card.Description></Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <a>
                                        <Icon name='user' />
                                        Saldo De Gyms   :{this.state.gymsActuales}
                            </a>
                            </Card.Content>
                        </Card>                           

                        </Grid.Column>      
                    </Grid.Row>
                   
                  </Grid>
          </Layout>
      );   
  }
}


export default MiInfoProfe;

