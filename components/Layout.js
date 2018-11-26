import React from 'react';
import {Container} from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default (props) => {

 return (
  <div>
    <Container>
      <Head>
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"></link>
      </Head>
      <Header/>
     
     {props.children}
     
   
   <h1 style={{  fontSize: "xx-small" }} > © 2018, GymsSocialized.com . Todos los derechos reservados </h1> 
   
   </Container> 
  </div>
 );
};