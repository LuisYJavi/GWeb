
export function convNomYapellido (x,y,z) {

  const nomYapellidoConcatenado = x + "%" + y + "%" + z;    
  return nomYapellidoConcatenado;

}

export function convStringABytes32 (x) {

  var str = x;
  var bytes = "0x"; // char codes
       
  for (var i = 0; i < str.length; ++i) {
        
    var hex = str.charCodeAt(i).toString(16);
    bytes += hex;
           
  }
  console.log(bytes);
        
  return bytes;
}

export function Bytes32AString(x){
       
  var hex  = x.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
        
    if(hex.substr(n, 2) == "00"){}else{
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }}
    
 

  str = str.replace(/ /g,"");
  str = str.replace("%%%"," ");
  str = str.replace("%%%"," ");
  return str;
}

export function convNomYapellidoAtras(_A) {
  let nombreTransform = "";
  let apellidoTrans = "";
  let apellido2Trans ="";
  let k = 0;
    
    
  console.log(_A.charAt(0));
    
    
  console.log(nombreTransform);

  for (let i = 0; i < _A.length; i++) {
                
    if ((_A.charAt(i) === "%") && (nombreTransform == "")) {
      nombreTransform = _A.substring(0,i);
      k=i;
    }

    if ((_A.charAt(i) == "%") && (nombreTransform != "") && (k!=i)) {
      apellidoTrans = _A.substring(k+1,i);
      apellido2Trans = _A.substring(i+1 , _A.length);
    }

  }
  console.log(nombreTransform, apellidoTrans,apellido2Trans);
    

  return [nombreTransform,apellidoTrans,apellido2Trans];

  /*Esto se aplica en donde se quieran traer los valores

    const nombreApellTrans= convNomYapellidoAtras(nomYapellido);
    const nombre = nombreApellTrans[0];
    const apellido = nombreApellTrans[1];
    const apellido2 = nombreApellTrans[2];
    */


}

export function convDNI (_dni) {

  const dniInt = (_dni.charCodeAt(8)*1000) + (_dni.charCodeAt(9)*1)
                   + (_dni.substring(0,8)*1000000);

  return dniInt;

}

export function convVuelo (_vuelo) {

  const vuelo = (_vuelo.charCodeAt(0)*10000000) + (_vuelo.charCodeAt(1)*10000)
    + (_vuelo.substring(2,6)*1);

  return(vuelo);
}

export function convVueloAtras (_vuelo) {
    
  const numeroVueloDigitos = _vuelo;
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




