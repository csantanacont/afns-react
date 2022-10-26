import { useEffect } from "react";
import { useState } from "react"
import { AFN } from "./AFN";
import { CrearAFN } from "./helpers/AFN";
import { Button, Form } from 'react-bootstrap'
import { VistaAFNs } from "./VistaAFNs";
import { render } from "react-dom";
import Swal from 'sweetalert2'
import { AFNTxt } from "../AFNTxt";


export const Home = () => {
  
  const [afns, setAfns] = useState([])
  const [crearAFNRender, setCrearAFNRender] = useState(false);
  const [crearAFNTXTRender, setCrearAFNTXTRender] = useState(false);
  const [verAFNsRender, setVerAFnsRender] = useState(false)
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [afnSeleccionado, setAfnSeleccionado] = useState(-1);
  const [secuencia, setSecuencia] = useState("");
  const [me, setMe] = useState(false);

  let manejoErrores = [];

  useEffect(() => {
    ocultarAFNRender();
    ocultarAFNRenderTXT();
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

  const ocultarAFNRenderTXT = () =>{
    setCrearAFNTXTRender(false);
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
    manejoErrores = [];
    let {value:cadena} = document.getElementById("inputTest");
    let {value:idx} = document.getElementById("selectAFN");
    let automata = afns[idx];
    let estadosSiguientes = [automata.estadoInicial];
    let estadosAuxiliares = [...estadosSiguientes];
    for(let i=0;i<cadena.length;i++){
        console.log("EVALUANDO EL SIMBOLO: ", cadena[i])
        if(automata.alfabeto.includes(cadena[i])){
          estadosAuxiliares = generaSecuenciaEstados(cadena[i], i, estadosAuxiliares, automata)
          if(estadosAuxiliares.length > 0){
            estadosSiguientes = [...estadosAuxiliares]
          }
        }
        else{
          let error = {
            simbolo:cadena[i],
            posicion: i,
            mensaje: "El simbolo evaluado no pertenece al alfabeto definido en el AFN",
            estado: estadosSiguientes.at(0)
          };
          console.error("Consulta los errores");
          manejoErrores.push(error);
        }
      
    }
    if(manejoErrores.length > 0){
      setMe(true);
      alerta("Cadena rechazada", "Presiona mostrar errores para mas detalles", "error");
    }
    else{
      setMe(false)
      let cadenaAceptada = false;
      automata.estadosAceptacion.map(e => {
        estadosSiguientes.includes(e) ? cadenaAceptada = true : null;
      })
      
      cadenaAceptada ? alerta("Cadena aceptada", "La cadena ingresada pertenece al automata", "success") : alerta("Cadena no aceptada", "La cadena ingresada no pertenece al automata", "info");
    }
    
  }
  


  const generaSecuenciaEstados = (simbolo, idxSimbolo, estados, automata) => {
    let secuenciaEstados = [];
    estados.map(estadoActual => {
      automata.estados[estadoActual].transiciones.map( t => {
        t.alfabeto.includes(simbolo) 
        ? secuenciaEstados.push(t.estadoDestino) && console.log("q"+estadoActual+"("+simbolo+")->",t.estadoDestino) : null;
      })
      
    })
    
    if(secuenciaEstados.length === 0){
      let i = estados.length -1;
      let error = {
        simbolo:simbolo,
        posicion: idxSimbolo,
        mensaje: "El simbolo evaluado no tiene una transicion hacia un estado valido",
        estado: estados.at(-1)
      };
      console.error("Consulta los errores");
      manejoErrores.push(error);
    }
    
    return secuenciaEstados;
  }
  const mostrarOcultarListaAFNRender = ()=>{
    setVerAFnsRender(!verAFNsRender)
    setMostrarTabla(false)
  }

  const mostrarCrearAFNTxt = () =>{
    setCrearAFNTXTRender(true);
    setMostrarTabla(false);
    setVerAFnsRender(false);
  }
  const verErrores = () => {
    console.table(manejoErrores);
  }
  return (
    <main className="Home">
      {
        !crearAFNRender && !crearAFNTXTRender && <div className="inicio">
          <h1> AUTOMATAS FINITOS DETERMINISTAS </h1>
          <div className="botonesInicio">
            <Button
            onClick={mostrarAFNRender}
            size='lg'
            > Crear AFN </Button>
            <Button
            onClick={mostrarCrearAFNTxt}
            size="lg"
            >
              Crear AFN desde texto
            </Button>
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
        crearAFNTXTRender && <AFNTxt ocultarAFNRenderTXT= {ocultarAFNRenderTXT} enviarAFN = {recibirAFN}/>
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
            {me && <Button onClick={verErrores} variant="danger"> Mostrar errores </Button>}
          
          </div>
            <div><VistaAFNs automatas={afns} idx={afnSeleccionado}/></div>
          </div>
      }
    </main>
  )
}
