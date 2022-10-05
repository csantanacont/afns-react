import { useEffect } from "react";
import { useState } from "react"
import { AFN } from "./AFN";
import { CrearAFN } from "./helpers/AFN";
import { Button, Form } from 'react-bootstrap'
import { VistaAFNs } from "./VistaAFNs";
import { render } from "react-dom";
import Swal from 'sweetalert2'


export const Home = () => {
  
  const [afns, setAfns] = useState([])
  const [crearAFNRender, setCrearAFNRender] = useState(false);
  const [verAFNsRender, setVerAFnsRender] = useState(false)
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [afnSeleccionado, setAfnSeleccionado] = useState(-1);

  useEffect(() => {
    ocultarAFNRender();
  }, [afns])
  
  const setAFN = (nombre, estados, inicial, final, transiciones) => {
    let afn = new CrearAFN(nombre, estados, inicial, final, transiciones);
    let afnsNuevos = [...afns]
    afnsNuevos = [...afnsNuevos, afn];
    setAfns([...afns, afn]);

  }
  const recibirAFN = (automata) =>{
      const {nombre, e, eAceptacion, eInicial, sigma, t} = automata;
      setAFN(nombre, e, eInicial, eAceptacion, t, sigma); 
  }

  const mostrarAFNRender = () =>{
    setCrearAFNRender(true);
    setMostrarTabla(false);
    setVerAFnsRender(false);

  }
  const ocultarAFNRender = () =>{
    setCrearAFNRender(false);
  }
  const mostrarTablaAFNHandler = () => {
    let {value} = document.getElementById("selectAFN")
    if(value < 999999 )
    {
      setAfnSeleccionado(value)
      setMostrarTabla(!mostrarTabla)
    }else{
      setMostrarTabla(false)
    }
  }
  const alerta = (mensajeHeader, mensaje, tipoMensaje) =>{
    Swal.fire(
      `${mensajeHeader}`,
      `${mensaje}`,
      `${tipoMensaje}`
    )
  }

  const probarCadena = () => {
    let {value:cadena} = document.getElementById("inputTest");
    let {value:idx} = document.getElementById("selectAFN");
    let automata = afns[idx];
    let estadosSiguientes = [automata.estadoInicial];

    for(let i=0; i<cadena.length;i++){
        estadosSiguientes = generaSecuenciaEstados(cadena[i], estadosSiguientes, automata);
    }

    if(estadosSiguientes.length === 0){
      alerta("Cadena rechazada", "La cadena no es aceptada por el automata.", 'error');
    }else{
      let seAceptoLaCadena = false;
      estadosSiguientes.map(eIdx => {
        if(automata.estadosAceptacion.includes(eIdx)){
          seAceptoLaCadena = true;
        }
      })
      if(seAceptoLaCadena){
        alerta("Cadena aceptada", "La cadena es aceptada por el automata.", 'success');    
      }else{
        alerta("Cadena rechazada", "La cadena no es aceptada por el automata.", 'error')
      }
    }
  }
  


  const generaSecuenciaEstados = (simbolo, estadosActuales, automata) => {
    let secuenciaEstados = [];
    estadosActuales.map( idx => {
      automata.estados[idx].transiciones.map( t => {
        t.alfabeto.includes(simbolo) ? secuenciaEstados.push(t.estadoDestino) : null
      })
    })

    return secuenciaEstados;
  }
  const mostrarOcultarListaAFNRender = ()=>{
    setVerAFnsRender(!verAFNsRender)
    setMostrarTabla(false)
  }
  return (
    <main className="Home">
      {
        !crearAFNRender && <div className="inicio">
          <h1> AUTOMATAS FINITOS DETERMINISTAS </h1>
          <div className="botonesInicio">
            <Button
            onClick={mostrarAFNRender}
            size='lg'
            > Crear AFN </Button>
            {
              afns.length > 0 && 
              (<Button
              size = "lg"
              id = "btnVerAFNs"
              onClick={mostrarOcultarListaAFNRender}>
              {!verAFNsRender ? `Ver lista de AFNs` : `Ocultar lista de AFNs`} </Button>)
            }
          </div>
        
        </div>
      }
      {
        crearAFNRender && <AFN ocultarAFNRender = {ocultarAFNRender} enviarAFN = {recibirAFN}/>
      }
      {
        verAFNsRender && 
        <div className="lista">
          <Form.Select 
          size="sm-lg"
          id="selectAFN"
          >
            <option value={999999}> Selecciona un automata de la lista </option>
            {
              afns.map( (automata, idx) =>
              (<option key={idx} value={idx}> {automata.nombre} </option>)
            )
            }
          </Form.Select>
          <img onClick={mostrarTablaAFNHandler} className='icon' id="watchIcon" src='https://img.icons8.com/color/344/visible.png'/>

          
        </div>

      }
      {
         mostrarTabla && <div>
          <div className="test">
            Ingresa una cadena para probar el automata
            <Form.Control id="inputTest" size="sm" ></Form.Control>  
            <Button onClick={probarCadena}> PROBAR </Button>
          
          </div>
            <div><VistaAFNs automatas={afns} idx={afnSeleccionado}/></div>
          </div>
      }
    </main>
  )
}
