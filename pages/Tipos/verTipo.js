import React, {Component} from 'react';
import { Grid, Card, Button, Image, } from 'semantic-ui-react'
import factory from '../../ethereum/lectorContratos/factory';
import tiposClases from '../../ethereum/lectorContratos/tiposContrato';
import Layout from '../../components/Layout';
import {Link} from '../../routes';
import {Bytes32AString} from '../../transformers'

class indiceDeTipos extends Component {
  static async getInitialProps() {
    
    const dirTipos = await factory.methods.verDireccionesMaestras().call();
    const tipoContrato = tiposClases(dirTipos[0]);
    const tipoClasesNombres =  await tipoContrato.methods.verTiposNombres().call();
    var informacionTipo = []; 
    
    for (var i = 0; i < tipoClasesNombres.length;  ++i){
    informacionTipo[i] = await tipoContrato.methods.verTipoInfo(tipoClasesNombres[i].substr(0, 62)).call();
    informacionTipo[i].Prop3 = tipoClasesNombres[i];
    }
    console.log(tipoClasesNombres , informacionTipo );

    return { tipoClasesNombres , informacionTipo };
  }

renderTipos() {
  const items = this.props.informacionTipo.map(tipo => {
  console.log(tipo.Prop3);
  const tipoNom = Bytes32AString(tipo.Prop3);
  console.log(tipoNom );
  const tipoNomC = tipoNom.substr(1,(tipoNom.length)-1);
  console.log(tipoNomC);
  const duracionH = Math.floor(tipo["0"]/3600);
  var h = "";
  var m= "";
  var duracionM = "";
  if (duracionH == 1) {h =" hora "}{h = " horas "}
  if (duracionH != 1) {duracionM = (tipo["0"]-3600)/60, m = "minutos"}
  else{duracionM = "", m=""}
   
  m = "";
  
  const coste =tipo["1"];
  const obsoleta = tipo["2"];
  const ruta = `/static/${tipoNomC}.jpg`  
  console.log(ruta); 
    return{
      
      header: (tipoNomC),
      description: ( 
        <content >
        <Grid columns={2} divided>
        
        <Grid.Column>
        <Image src =  {ruta}/>
        
        </Grid.Column>
        <Grid.Column>
        <br />

        <div  style={{fontSize: "large"}} > {"Dura: " + duracionH + h + duracionM + m} </div> 
        <br />
        <div  style={{fontSize: "large"}}> {"Cuesta: " + coste + " gyms"} </div>
        </Grid.Column>
        </Grid>
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
          
    <h3 style={{ fontSize: "xx-large" }}>Tipos de Clases!!</h3>
      
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

  
    <div style={{ fontSize: "medium" }}> { this.renderTipos() } </div>
   
    </div>
</Layout>
  );
}

}
export default indiceDeTipos;

