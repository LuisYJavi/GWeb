pragma solidity ^0.4.24;

library SafeMath {
   function add(uint a, uint b) internal pure returns (uint c) {
       c = a + b;
       require(c >= a);
   }
   function sub(uint a, uint b) internal pure returns (uint c) {
       require(b <= a);
       c = a - b;
   }
   function mul(uint a, uint b) internal pure returns (uint c) {
       c = a * b;
       require(a == 0 || c / a == b);
   }
   function div(uint a, uint b) internal pure returns (uint c) {
       require(b > 0);
       c = a / b;
   }
}

contract FabricadorClases{
  
    using SafeMath for uint;
    
    address public manager;
    address public fabricaDirClases;
    address public tiposDirContrato;
    address public alumnosDirContrato;
    address public profesoresDirContrato;

    //Se podría hacer trayendo el array y de clases y sumando, pero posiblement sea menos costoso hacer el call contra uint y mantener el uint en storage.
    uint public numClasesTot;
    address[] public clasesTodas;
    mapping (address => bool) public clasesCerradas;
    
    //el 0 somos nosotros, 1 prof, 2 alumnos. El total de controlDeGyms
    //siempre igual a iniS.
    uint[3] public controlDeGyms;
    uint iniS;
       
    
    
    constructor(uint initialSupply) public payable {
        manager = msg.sender;
        iniS = initialSupply;
        fabricaDirClases = address(this);
        numClasesTot = 0;
        controlDeGyms[0] = initialSupply;
        crearContratoTipos(manager);
        crearContratoAlumnos(manager);
        crearContratoProfesores(manager);
        }     
  
    function crearContratoTipos(address _manager) internal {
        //require (msg.sender == fabricaDirClases);
        require(tiposDirContrato == 0);
        tiposDirContrato = new tiposContrato(_manager);
        }   
    function crearContratoAlumnos(address _manager) internal {
        //require (msg.sender == fabricaDirClases);
        require(alumnosDirContrato == 0);
        alumnosDirContrato = new alumnosContrato(_manager);
        }   
    
    function crearContratoProfesores(address _manager) internal {
        //require (msg.sender == fabricaDirClases);
        require(profesoresDirContrato == 0);
        profesoresDirContrato = new profesoresContrato(_manager);
        }      
           
    function crearNuevaClase (bytes32 _id, uint _fechaHora, uint _maxAlumnos, bytes32 _direccion, address _profesorDir) public {
        require (msg.sender == _profesorDir);
        
        profesoresContrato P = profesoresContrato(profesoresDirContrato);
        (bytes32 profesorNom,) = P.verProfesorNombreRating(msg.sender);
        require(profesorNom != "");
       
        address nuevaClase = new claseContrato(fabricaDirClases, manager, _profesorDir, _id, _direccion, _fechaHora, _maxAlumnos);
        clasesTodas.push(nuevaClase);
                               
        //Igual mejor al cierre.
        numClasesTot += 1;
        }

    function verDireccionesMaestras() public view returns (address, address, address){
        return (tiposDirContrato, alumnosDirContrato, profesoresDirContrato);
        }


    function verAddrClasesCreadas() public view returns (address[]){
        return clasesTodas;
        }
    function ajusteGymsAlPositivo(uint aPagar) public {
        controlDeGyms[0] = SafeMath.add(controlDeGyms[0], aPagar);
        controlDeGyms[2] = SafeMath.sub(controlDeGyms[2], aPagar);        
        }
    function ajusteGymsAlNegativo(uint aPagar) public {
        controlDeGyms[2] = SafeMath.add(controlDeGyms[2], aPagar);
        controlDeGyms[0] = SafeMath.sub(controlDeGyms[0], aPagar);        
        }
    
    function cierreDeClase(address _claseAlCierre, bytes32 tipoId, uint numAlumnos, address profesorDir, int claseRat) external returns (bool) {
        
        require (!(clasesCerradas[ _claseAlCierre]));
        tiposContrato T = tiposContrato(tiposDirContrato);
        (, uint _claseCoste, ) = T.verTipoInfo(tipoId);

        uint aPagar = _claseCoste * numAlumnos;

        profesoresContrato P = profesoresContrato(profesoresDirContrato);
         
        (int profesorRat, uint profesorNumClase, uint profesorGyms) = P.verProfesorInfoSimplificada(profesorDir);

        profesorGyms =  SafeMath.add(profesorGyms, aPagar);
        profesorRat = profesorRat + claseRat;
        profesorNumClase = SafeMath.add(profesorNumClase, 1);

        controlDeGyms[1] = SafeMath.add(controlDeGyms[1], aPagar);
        controlDeGyms[0] = SafeMath.sub(controlDeGyms[0], aPagar);
        
        clasesCerradas[_claseAlCierre] = true;
        return (true);
        }
   
  
    //bloqueamos los pagos o la entrada de funciones inesperadas
    function () public payable {
        revert();
        }
}

contract claseContrato {
 
    using SafeMath for uint;
    
    //datos Maestros 8se podría invocando a la funcion de dirMaestras. Al final gastaría más gas
    address manager;
    address public fabrica;
    address public addTipos; 
    address public addAlumnos; 
    address public addProfesores;
    bytes32 public tipoId;

    //Datos de la clase que el profesor pasa,
    uint public fecha;
    bytes32 public direccion;
    address public profesorDir;
    uint public maxAlumnos;
    uint public numAlumnos;
    //la hago storage, ya que parece que se va ausar mucho
    uint claseCoste;

    //estados de los alumnos
    mapping (uint => bytes32) public alumnosIdNombres;
    mapping (uint => bool) public alumnosIdEsta;
    mapping (uint => bool) public alumnosIdVotado;
    
    //rating   
    uint votos;
    int claseRat;
    
    //estados de la clase 
    bool public clasePermiteAlumnos;
    bool public claseAcabada;
    bool public claseCerrada;
    
    constructor (address _fabrica, address _manager, address _profesorDir,  bytes32 _tipoId, bytes32 _direccion, uint _fecha, uint _maxAlumnos) public {
                
        manager =_manager;
        profesorDir = _profesorDir;
        fabrica = _fabrica;
        tipoId = _tipoId;

        FabricadorClases F = FabricadorClases(fabrica);
        (addTipos, addAlumnos, addProfesores)= F.verDireccionesMaestras();

        //No vale para nada traer la info del proveedor. ya que se puede ir al otor contrato a bsucar la info.
        //profesoresContrato P = profesoresContrato(dirP);
        //(bytes32 profNombre, int profRat ) = P.verProfesorNombreRating(_profesorDir);

        //lo requerimos para el control, pero la info en si la buscaremos en el contrato de tipos
        //cada vez que abramos la página en js
        tiposContrato T = tiposContrato(addTipos);   
        (, uint _claseCoste, bool obs) = T.verTipoInfo(_tipoId);
        claseCoste = _claseCoste;
        require(obs == false);
        require(_tipoId != 0);
       
        numAlumnos = 0;
        maxAlumnos = _maxAlumnos;
        fecha = _fecha;
        direccion = _direccion;
        claseCerrada = false;
        claseAcabada = false;
        clasePermiteAlumnos = true;
        }

    function annadirAlumnos(uint _alumnoId) cNoAcabada cAbierta public {
        
        require (clasePermiteAlumnos);
        
        alumnosContrato A = alumnosContrato(addAlumnos);
        
        (bytes32 alumnoNom) = A.annadirAlumnoClase(_alumnoId, address(this), claseCoste);
        
        alumnosIdNombres[_alumnoId] = alumnoNom;
        alumnosIdEsta[_alumnoId] = true;
        alumnosIdVotado[_alumnoId] = false;
        numAlumnos = SafeMath.add(numAlumnos,1);
        
        if (numAlumnos == maxAlumnos ){clasePermiteAlumnos = false;}
        }
        
    //falta implementar penalizacio por cierre tardio
    function bajaAlumnos(uint _alumnoId) cNoAcabada cAbierta public {
    
        require (alumnosIdEsta[_alumnoId] == true);
        alumnosContrato A = alumnosContrato(addAlumnos);
        A.bajaAlumnoClase(_alumnoId, address(this), claseCoste);
        
        delete(alumnosIdNombres[_alumnoId]);
        delete(alumnosIdEsta[_alumnoId]);
        delete(alumnosIdVotado[_alumnoId]);
        
        numAlumnos = SafeMath.sub(numAlumnos,1);
        clasePermiteAlumnos = true;
            
        }

    function profesorFinalizaClase() public cNoAcabada cAbierta {
        require ((msg.sender == profesorDir) || (msg.sender == manager));
        tiposContrato T = tiposContrato(addTipos);   
        (uint claseDur, , ) = T.verTipoInfo(tipoId);
        require (now >= (fecha + claseDur));
        claseAcabada = true;
        }

    function ratingClase(bool _valor, uint _alumno) public cAbierta {
        require (msg.sender == manager);
        require (claseAcabada == true);
        require (alumnosIdEsta[_alumno]);
        
        int k;
        if (_valor == true) {k = 1;} else {k = -1;}
        
        claseRat = claseRat + k;
        alumnosIdVotado[_alumno] = true;
        votos = SafeMath.add(votos , 1);

        if (votos == numAlumnos){
        FabricadorClases F = FabricadorClases(fabrica);    
        F.cierreDeClase(address(this), tipoId, numAlumnos, profesorDir, claseRat);
            claseCerrada = true;
            claseAcabada = true;
            clasePermiteAlumnos = false;
            }

        }

    /*INDEPENDIENTEMENTE DE QUIEN HAYA VOTADO a LAS 24H DEL INICIO DE LA CLASE SE CIERRA LA CLASE
    */ 
    function cierre24H() public cAbierta{
                
        require (now >= (fecha + (3600*24)));
        require(msg.sender == manager);
        
        FabricadorClases F = FabricadorClases(fabrica);   
        F.cierreDeClase(address(this), tipoId, numAlumnos, profesorDir, claseRat);
            claseCerrada = true;
            claseAcabada = true;
            clasePermiteAlumnos = false;
        }

   /*El profesor "puede" cerrar la clase y cobrar
       aunque el día no haya acabado SIEMPRE YB CUANDO
       al menos el 25% de alumnos hayan votado Y hayan pasado 3H del inicio de la clase
        */ 

    function cierreProfesor() public cAbierta{
        
        require (numAlumnos!=0);
        uint checkAlum = votos*(10**10)/numAlumnos;
        require (now >= (fecha + (3600*3)));
        require(msg.sender == profesorDir);
        require(checkAlum > 2500000000);
        
        FabricadorClases F = FabricadorClases(fabrica);   
        F.cierreDeClase(address(this), tipoId, numAlumnos, profesorDir, claseRat);
            claseCerrada = true;
            claseAcabada = true;
            clasePermiteAlumnos = false;

            }  
    
    modifier cAbierta{
        require(claseCerrada == false);
        _;
        }
    modifier cNoAcabada{
        require(claseAcabada == false);
        _;
        }
    
    
}

contract alumnosContrato {
    using SafeMath for uint;
    address fabrica;
    address manager;
    
    mapping(uint=>alumnos) public alumnoId;
    struct alumnos{
        bytes32 alumnoNom;
        int alumnoRat;
        uint alumnoNumClase;
        uint alumnoGyms;
        mapping (address=>bool) alumnoApuntadoClase;
        address[] alumnoClases;
        }

    constructor(address _manager) public {
        manager = _manager;
        fabrica = msg.sender;
        }

    function creaNuevoAlumno(uint id, bytes32 nombre) public returns (bool){
        require(nombre.length > 0);
        require (msg.sender == manager);
        require (alumnoId[id].alumnoNom == "" );
        
        alumnos storage A = alumnoId[id];
            A.alumnoNom = nombre;
            A.alumnoRat = 0;
            A.alumnoNumClase= 0;
         bool creado = true;
        return(creado);
         }
    
    function verAlumnoInfo(uint id) public view returns(bytes32, uint, int, address[]){
        require(id > 0);
        require (msg.sender == manager);
        require (alumnoId[id].alumnoNom != "" );
        alumnos storage A = alumnoId[id];
        return(A.alumnoNom, A.alumnoGyms, A.alumnoRat, A.alumnoClases);
        } 
    
    //Se llama desde la fabrica
    function annadirAlumnoFondos(uint id, uint numTokens) public returns (bool){
        require (msg.sender == manager);
        require (alumnoId[id].alumnoNom != "" );
        alumnos storage A = alumnoId[id];
        A.alumnoGyms = SafeMath.add(A.alumnoGyms, numTokens);
        
        FabricadorClases F = FabricadorClases(fabrica);
        F.ajusteGymsAlNegativo(numTokens);  
        
        bool transferido = true;
        return (transferido);
        }

    //Se llama desde el contrato de la clase!
    function annadirAlumnoClase(uint _id, address _clase, uint _claseCoste) external returns (bytes32) {
        require (alumnoId[_id].alumnoNom != "");
        
        alumnos storage A = alumnoId[_id];
        require(A.alumnoApuntadoClase[_clase] == false);
        require(A.alumnoGyms >= _claseCoste);

        A.alumnoGyms = SafeMath.sub(A.alumnoGyms, _claseCoste);
        A.alumnoApuntadoClase[_clase] = true;
        A.alumnoNumClase = SafeMath.add(A.alumnoNumClase, 1);
        FabricadorClases F = FabricadorClases(fabrica);
        F.ajusteGymsAlPositivo(_claseCoste);             
        return(A.alumnoNom);
        }

    //Se llama desde el contrato de la clase!   
    function bajaAlumnoClase(uint id, address _clase, uint _claseCoste) external {
        require (alumnoId[id].alumnoNom != "");
                
        alumnos storage A = alumnoId[id];
        require(A.alumnoApuntadoClase[_clase] == true);
        A.alumnoGyms = SafeMath.add(A.alumnoGyms,_claseCoste);
        A.alumnoApuntadoClase[_clase] = false;
        A.alumnoNumClase = SafeMath.sub(A.alumnoNumClase, 1);
        FabricadorClases F = FabricadorClases(fabrica);
        F.ajusteGymsAlNegativo(_claseCoste); 

        }

    function() public payable {
        revert();
        }


}

contract profesoresContrato{
    using SafeMath for uint;
    address fabricaContrato;
    address manager;

    mapping(address=>profesores) public profesorDir;   
        
    struct profesores{
        bytes32 profesorNom;
        int profesorRat;
        uint profesorNumClase;
        uint profesorGyms;
        address[] profesorClases;
        }


    constructor(address _manager) public {
        manager = _manager;
        fabricaContrato = msg.sender;
        }

    function creaNuevoProfesor(address _profesorDir, bytes32 _nombre) public returns (bool){
                
        require (msg.sender != 0);
        require (_nombre.length > 0);
        
        
        profesores storage profesor = profesorDir[_profesorDir];
        
        require (profesor.profesorNom == "");
        profesor.profesorNom = _nombre;
        profesor.profesorRat = 0;
        profesor.profesorGyms = 0;
        profesor.profesorNumClase = 0;

        bool creado = true;
        return(creado);
        }

    //Se usará para dar info total al profesor ó recuperar info para controlar nosotros
    function verProfesorInfo(address _profesorDir) public view returns (bytes32, int, uint, uint, address[]){
        //require ((msg.sender == _profesor) || (msg.sender == manager)); esta linea no funciona habra que desdoblarla, 
        //para controlarlos
        require ((msg.sender == _profesorDir));

        profesores memory profesor = profesorDir[_profesorDir];
        return(profesor.profesorNom, profesor.profesorRat, profesor.profesorNumClase, profesor.profesorGyms, profesor.profesorClases);
        }  

    function verProfesorInfoSimplificada(address _profesorDir) public view returns (int, uint, uint){
        //require ((msg.sender == _profesor) || (msg.sender == manager)); esta linea no funciona habra que desdoblarla, 
        //para controlarlos
        require ((msg.sender == _profesorDir));

        profesores memory profesor = profesorDir[_profesorDir];
        return(profesor.profesorRat, profesor.profesorNumClase, profesor.profesorGyms);
        } 
    
    
    
    //Se usará para rellenar la infor de las clases
    function verProfesorNombreRating(address _profesorDir) public view returns (bytes32, int){
        
        profesores memory profesor = profesorDir[_profesorDir];
        
        return(profesor.profesorNom, profesor.profesorRat);
        }  
    
    function () public payable {
        revert();
        }

}

contract tiposContrato {

    //El unico problema no se pueden cambiar nombres de las clases.
    //Pero se puede poenr en obsoleta y crear una nueva.  
    using SafeMath for uint;
    address fabricaContrato;
    address public manager;
    
    struct tipos{
        uint tipoDuracion;
        uint tipoCoste;
        bool tipoObsoleta;
        }

    mapping (bytes32 => tipos) public tipoId;
    mapping (bytes32 => bool) public tipoExisteId;
    bytes32[] tiposNombres;

    constructor(address _manager) public {
        manager = _manager;
        fabricaContrato = msg.sender;
        }
     
    function creaNuevoTipo(bytes32 _nombre, uint _dur, uint  _cost ) public {  
        require (msg.sender == manager); 
        require ((_cost == 1) || (_cost == 2));
        require (tipoExisteId[_nombre]==false);

               
        tipos storage nuevotipo = tipoId[_nombre];
        require (nuevotipo.tipoDuracion == 0);
        nuevotipo.tipoDuracion= _dur;
        nuevotipo.tipoCoste = _cost;
        nuevotipo.tipoObsoleta = false;
        tipoExisteId[_nombre] = true;
        tiposNombres.push(_nombre); 
        }
    
    function modificarTipo(bytes32 _nombre, uint _dur, uint  _cost, bool _obs) public {   
        require (msg.sender == manager); 
        require ((_cost == 1) || (_cost == 2));
        
        tipos storage modtipo = tipoId[_nombre];
        modtipo.tipoDuracion= _dur;
        modtipo.tipoCoste = _cost;
        modtipo.tipoObsoleta = _obs;
        }
    //realmente no haría FALTA. Posiblemente se pueda llamar directamente al mapping. Es un funcion interna
    function verTipoInfo(bytes32 _nombre) public view returns (uint, uint, bool){   
        
        tipos memory verTipo = tipoId[_nombre];
        return(verTipo.tipoDuracion, verTipo.tipoCoste, verTipo.tipoObsoleta);
        }
   
    function verTiposNombres() public view returns (bytes32[]){   
        return(tiposNombres);
        }
    
    function () public payable {
        revert();
        }
}
