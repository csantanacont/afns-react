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
  const [epsilon, setEpsilon] = useState([]);
  const [alfa, setAlfa] = useState([]);

  let estadosEpsilon = [];
  let estadosAlfa = [];

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
  const cerraduraEpsilon = (estado, automata) => {
    // console.log("Calculando transiciones epsilon de ", estado)
    let conjuntoEstadosEpsilon = [];
    let pilaEstadosPendientes = [];
    if(typeof(estado) == "number"){
      pilaEstadosPendientes.push(estado);
    }
    if(typeof(estado) == "object"){
      pilaEstadosPendientes = [...estado];
    }
    
    let v;
    let estadosTemporales = [];
    let estadosOrigen = [];
    let estadosDestino = [];
    while(pilaEstadosPendientes.length !== 0){
      v = pilaEstadosPendientes.shift();
      estadosTemporales = [];
      conjuntoEstadosEpsilon.push(v);
      automata.estados[v].transiciones.forEach(t => {
        if(t.alfabeto.includes("E")){
          if(!conjuntoEstadosEpsilon.includes(t.estadoDestino)){
            pilaEstadosPendientes.push(t.estadoDestino);        
            estadosTemporales.push(t.estadoDestino);
          }
        }
      });
      estadosOrigen.push(v);
      estadosDestino.push(estadosTemporales);
      if(estadosTemporales.length >0){
        // console.log("q"+v+"(E)--->{"+estadosTemporales+"}")  
        // console.log("Origen",estadosOrigen," - destino", estadosDestino)
      }
      // else
        // console.log("q"+v+"(E)---> {}")
    }
    // let temp = [];
    // temp.push(estadosOrigen);
    // temp.push(estadosDestino);
    // estadosEpsilon.push(temp);
    conjuntoEstadosEpsilon = conjuntoEstadosEpsilon.sort(function(a, b){return a-b});
    console.log("Cerradura EPSILON DE "+estado+": "+conjuntoEstadosEpsilon)
    return conjuntoEstadosEpsilon;
    
  }

  const mover = (estado, simbolo, automata ) =>{
    let conjuntoDestino = [];
    let eDestino = [];
    let conjuntoOrigen = [];
    if(typeof(estado) == "number"){
      conjuntoDestino = automata.estados[estado].transiciones.map(t =>{
        if(t.alfabeto.includes(simbolo)){
          // console.log("q"+estado+"("+simbolo+")->{"+ t.estadoDestino+"}")
          return t.estadoDestino;
        } 
      })
    }
    if(typeof(estado) == "object"){
      estado.map(e => {
        automata.estados[e].transiciones.map(t =>{
          if(t.alfabeto.includes(simbolo)){
            // console.log("q"+e+"("+simbolo+")->{"+ t.estadoDestino+"}")
              conjuntoDestino.push(t.estadoDestino);
              conjuntoOrigen.push(e);
              // eDestino.push(e);
          } 
          else{
            
            // conjuntoOrigen.push(e);
            // conjuntoDestino.push([]);
            // console.log("q"+e+"("+simbolo+")->{}")
          }
        })
      })
    }
    // let temp = [];
    // temp.push(conjuntoOrigen, conjuntoDestino);
    // estadosAlfa.push(temp);
    // conjuntoOrigen.map((o, idx) => {
    //   console.log(o);
    // })
    console.log(""+conjuntoOrigen);
    console.log(""+conjuntoDestino);
    
    return conjuntoDestino;
    // console.log("El conjunto destino de ", estado, "con ",simbolo, "es ", conjuntoDestino )
  }

  const IrA = (estados, simbolo, automata) =>{
    let conjuntoResultante = [];
    let moverConjunto = mover(estados, simbolo, automata);
    conjuntoResultante = cerraduraEpsilon(moverConjunto, automata);

    return conjuntoResultante;
  }


  const probarCadena = () => {
    manejoErrores = [];
    let esAceptacion = false;
    let {value:cadena} = document.getElementById("inputTest");
    let {value:idx} = document.getElementById("selectAFN");
    let automata = afns[idx];
    let conjuntoA = [];
    conjuntoA = cerraduraEpsilon(automata.estadoInicial, automata);
    // console.log("Se inicia desde el conjunto  de estados EPSILON: ", conjuntoA);

    for(let i = 0; i<cadena.length; i++){
      let caracter = cadena[i];
      console.log("Analizando el caracter "+caracter)
      conjuntoA = IrA(conjuntoA, caracter, automata);
      // console.log(conjuntoA)
      
    }

    esAceptacion = compruebaEstadosAceptacion(conjuntoA, automata);

    // setAlfa([...estadosAlfa]);
    // setEpsilon([...estadosEpsilon]);

    // console.log(estadosEpsilon);

    // console.log(estadosAlfa);

    esAceptacion ? console.log("El conjunto final contiene algun estado de los siguientes: "+automata.estadosAceptacion+" por tanto, es CADENA ACEPTADA") :  console.log("El conjunto final no contiene algun estado de los siguientes: "+automata.estadosAceptacion+" por tanto, es CADENA RECHAZADA")
  }
  
  const compruebaEstadosAceptacion = (estados, automata) =>{
    let aceptada = false;
    estados.map(e =>{
      automata.estadosAceptacion.includes(e)? aceptada = true : null;
    })

    return aceptada;
  }

  // const generaSecuenciaEstados = (simbolo, idxSimbolo, estados, automata) => {
  //   let secuenciaEstados = [];
  //   let secuenciaEstadosEpsilon = [];
  //   let normales = false;
  //   let epsilon = false;
  //   estados.map(estadoActual => {
  //     automata.estados[estadoActual].transiciones.map( t => {
  //       if(t.alfabeto.includes(simbolo)){
  //         secuenciaEstados.push(t.estadoDestino);
  //         console.log("q"+estadoActual+"("+simbolo+")->",t.estadoDestino);
          
  //       }else if(t.alfabeto.includes("E")){
  //         secuenciaEstadosEpsilon.push(t.estadoDestino);
  //         esEpsilon = true;
  //         console.log("q"+estadoActual+"("+simbolo+") EPSILON->",t.estadoDestino);
          
  //       }
  //     })
      
  //   })
    
  //   if(secuenciaEstados.length === 0 && secuenciaEstadosEpsilon === 0){
  //     let i = estados.length -1;
  //     let error = {
  //       simbolo:simbolo,
  //       posicion: idxSimbolo,
  //       mensaje: "El simbolo evaluado no tiene una transicion hacia un estado valido",
  //       estado: JSON.stringify(estados)
  //     };
  //     console.error("Consulta los errores");
  //     manejoErrores.push(error);
  //   }
  //  if(secuenciaEstados.length > 0){
  //   esEpsilon = false;
  //   return secuenciaEstados;
  //  }
  //  else{
  //   esEpsilon = true;
  //   return secuenciaEstadosEpsilon;
  //  }
    
   
   
    
  // }
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
       <div>
          {
            epsilon.map((e,idx) =>{
              return (<>
              <div>{JSON.stringify(e[0])}</div>
              <div>{JSON.stringify(e[1])}</div>
              </>)
            })
          }
        </div>
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
