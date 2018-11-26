import React, {Component} from 'react';
import { Form, Grid, Card, Button, Image, Input, Message, Icon } from 'semantic-ui-react'
import factory from '../../ethereum/lectorContratos/factory';
import profesor from '../../ethereum/lectorContratos/profesoresContrato';
import Layout from '../../components/Layout';
import {Link} from '../../routes';

import {Bytes32AString} from '../../transformers';

class MiInfoProfe extends Component {
    
  state = {
      address: '',
      errorMessage: '',
      loading: false,
      GymsActuales:'',
      rating: [],
      numClase: 0,
      nombre: ""
  };

  
  onSubmit = async (event) => {
      event.preventDefault();
      console.log(this.state.address);
      this.setState({ loading: true, errorMessage: '' });

      try {
          console.log(this.state.address);
          //const nombreYrating = 0;         
          const dirTipos = await factory.methods.verDireccionesMaestras().call();   
          console.log(dirTipos);
          const nombreYrating = await profesor(dirTipos[2]).methods.verProfesorNombreRating(this.state.address).call();
          //const GymsActuales = await factory.methods.checkGananciasProfesor(this.state.address).call();
          console.log(nombreYrating);
          const nombreTrans = Bytes32AString(nombreYrating[0]);

          console.log(nombreYrating[0]);
          
                              
          this.setState({ nombre: nombreTrans, rating: nombreYrating[1]});//

         
      } catch (err){
          this.setState({ errorMessage: err.message});
      }

          this.setState({ loading: false });

  };
  
  

  
  render(){
  
      return (
          <Layout>
              <h1 style={{  fontSize: "xx-large" }}>Profesor!!!</h1>
                  <Grid >
                      <Grid.Row columns={2}>
                        <Grid.Column width={10}>
                            <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                                <Form.Field  >
                                    <label style={{  fontSize: "large" }}>Dirección Ethereum</label>
                                   
                                    <Input 
                                        placeholder='0x0000...'
                                        
                                        value = {this.state.address}
                                        onChange = {event =>
                                        this.setState({ address: event.target.value})}
                                        
                                    />
                                    <div class="ui pointing label">
                                       Por fa pon tu dirección como la ves en MetaMask. Puede clicar en copiar al portapapeles.
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
                                    <div> Eres Profesor y no tienes cuenta????  Clica aqui!!!!!       </div>
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

                        <Grid.Column width={4}>      
                            <Card color='red'>
                            <Image  src =  "/static/profesor2.jpg"  centered/>
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
                                        Saldo De Gyms:{this.state.GymsActuales}
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

