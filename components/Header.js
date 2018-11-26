import react from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import {Link} from '../routes';


export default ()=> {
     return (
      <Menu style={{ marginTop: '10mm', fontSize: "large"}}>

        <Link route="/">
        <a className="item">            
              Clases
        </a>            
          </Link>

        <Dropdown item text='Profesores'>
            <Dropdown.Menu>
            <Dropdown.Item>
              <Link route="/Profesores/verProfe">
                <a >
                Profesores
                </a>
              </Link>

            </Dropdown.Item>
            <Dropdown.Item>
              <Link route="/Profesores/nuevo">
                <a >
                Date de Alta
                </a>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link route="/Profesores/nuevaClase">
                <a >
                Organizar una Clase!!
                </a>
              </Link>
            </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>  


        
        <Dropdown item text='Tipos de Clases'>
            <Dropdown.Menu>
            <Dropdown.Item>
            <Link route="/Tipos/verTipo">
              <a>
                 Ver los Tipos De Clases Que Disponemos
              </a>
             </Link>
            </Dropdown.Item>
            <Dropdown.Item>
            <Link route="/Tipos/nuevoTipo">
                <a>
                GESTION: Tipos De Clases Nuevo
                </a>
              </Link>
            </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>  

         <Dropdown item text='Mi cuenta'>
            <Dropdown.Menu>
            <Dropdown.Item>
            <Link route="/Alumnos/nuevoAlumno">
              <a>
                 Unete!!!
              </a>
             </Link>
            </Dropdown.Item>
            <Dropdown.Item>
            <Link route="/Alumnos/Alumno">
                <a>
                Mi Cuenta
                </a>
              </Link>
            </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown> 

       



      <Menu.Menu position='right'>
        <div className='ui right aligned category search item'>
          <div className='ui transparent icon input'>
            <input className='prompt' type='text' placeholder='Busca Clase' />
            <i className='search link icon' />
          </div>
          <div className='results' />
        </div>
      </Menu.Menu>


      </Menu>
    )
  }