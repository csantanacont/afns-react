import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Estado } from "./Estado";
import { EstadoAFN } from "./helpers/AFN";
import Swal from 'sweetalert2'


export const AFN = ({ocultarAFNRender, enviarAFN}) => {
  const [numeroEstados, setNumeroEstados] = useState(0);
  const [estados, setEstados] = useState([]);
  const [alfabeto, setAlfabeto] = useState([]);
  const [transiciones, setTransiciones] = useState([]);
  const [estadoInicial, setEstadoInicial] = useState(-1);
  const [estadosFinales, setEstadosFinales] = useState([]);
  const [mostrarEstados, setMostrarEstados] = useState(false);

  useEffect(() => {
    if (estadoInicial != -1) {
      for (let i = 0; i < estados.length; i++) {
        let elementoNoInicial = document.getElementById(`esInicial${i}`);
        elementoNoInicial.checked = false;
      }
      let inicial = document.getElementById(`esInicial${estadoInicial}`);
      inicial.checked = true;
    }
  }, [estadoInicial, estadosFinales, estados]);

  const crearAFN = async () =>{
    let tAux = definirTransiciones();
    definirAlfabeto();
    if(estados.length == 0){
      Swal.fire(
        'No hay estados',
        'Debes agregar estados para crear un AFN',
        'error'
      )
    }else if(estadoInicial === -1){
      Swal.fire(
        'Falta estado inicial',
        'Debes seleccionar un estado inicial',
        'error'
      )
    }else if(estadosFinales.length === 0){
      Swal.fire(
        'Falta estado de aceptacion',
        'Debes seleccionar al menos un estado de aceptacion',
        'error'
      )
    }else if(tAux.length === 0){
      Swal.fire(
        'No hay transiciones',
        'Debes agregar transiciones a los estados para crear el AFN',
        'error'
      )
    }else{
      definirEstadoInicialFinal();
      await Swal.fire({
        title: 'Ingresa un nombre para el AFN', 
        input: 'text'
      }).then(
        (inputValue) => {
          if (inputValue.value === "") {
            Swal.fire(
              'Falta nombre del AFN',
              'Debes escribir un nombre para el AFN',
              'error');
            return false
          }
          let afnFinal = {
            eInicial: estadoInicial,
            eAceptacion : estadosFinales,
            e : estados,
            sigma : alfabeto,
            t : tAux,
            nombre: inputValue.value
          }
          enviarAFN(afnFinal);
        }
      )
      
      
    }

    
  }
  const gestionaEstadosFinales = (id, esEstadoFinal) =>{
    if(esEstadoFinal === true){
        let nuevosEstadosFinales = [...estadosFinales, id].sort();
        setEstadosFinales(nuevosEstadosFinales);
    }else{
        let nuevosEstadosFinales = estadosFinales.filter((estado) => estado !== id);
        setEstadosFinales(nuevosEstadosFinales);
    }

  }

  const gestionarTransiciones = (index,transiciones) =>{

    let estado = estados[index];
    let estadosActuales = [...estados];
    estado.transiciones = transiciones;
    estadosActuales.splice(index, 1, estado )
    setEstados(estadosActuales);
  }

  const definirEstadoInicialFinal = () => {
    /**Definiendo estado inicial */
    let estadosDefinitivos = [...estados];
    estadosDefinitivos = estadosDefinitivos.map((e, i) => {
      if(i === estadoInicial){
        e.esInicial = true;
      }
      else{
        e.esInicial = false;
      }
      if(estadosFinales.includes(e.id)){
        e.esAceptacion = true;
      }
      return e;
    })
    setEstados(estadosDefinitivos);
  }

  const definirTransiciones = () =>{
    let transicionesDefinitivas = estados.map(e => {
      if(e.transiciones.length > 0){
        return e.transiciones;
      }
        return [];
    })
    transicionesDefinitivas = transicionesDefinitivas.filter(t => t.length !== 0)
    setTransiciones(transicionesDefinitivas);

    return transicionesDefinitivas;
  }

  const definirAlfabeto = () =>{
    let alfabetoAux = [];
    transiciones.map((t) => {
      t.map( te => {
        alfabetoAux = alfabetoAux.concat(te.alfabeto)
      })
    })
    alfabetoAux = new Set(alfabetoAux); 
    alfabetoAux = [...alfabetoAux].sort();
    setAlfabeto(alfabetoAux);
  }

  const handleValor = (e) => {
    const { value } = e.target;
    setNumeroEstados(value);
    setEstados(
      Array.from({ length: value }, (e, index) => (e = new EstadoAFN(index)))
    );
  };

  const showEstados = () =>{
    setMostrarEstados(true);
  }

  return (
    <>
    <br/>
      <h1>CREAR UN AUTOMATA FINITO DETERMINISTA</h1>
      <div className="inputNumEstados">
        <h6>Ingresa la cantidad de estados que tendra tu AFN:</h6>
        <Form.Control
          id="inputCantidades"
          type="number"
          min="1"
          disabled={mostrarEstados}
          size="sm-3"
          onChange={handleValor}
        />
        <Button
        onClick={showEstados}
        // size="sm-large"
        disabled={mostrarEstados}
        id="btnAgregarEstados"
        >
          Agregar
        </Button>
      </div>
      {
        mostrarEstados && (
          <div className="crearAFNDiv">
        {/* <Button  variant="primary" onClick={handleEstados}> Agregar </Button> */}
        <div className="estadosBoxDiv">
          {estados.map((e, index) => {
            return (
              <Estado
                key={index}
                estado={e}
                agregaTransiciones={setTransiciones}
                agregaEstadoInicial={setEstadoInicial}
                agregaEstadoFinal={gestionaEstadosFinales}
                numeroEstados ={numeroEstados}
                setTransicionesAFN = { gestionarTransiciones }
              />
            );
          })}
        </div>
      </div>
        )
      }
      <div className="botonesInicio">
       <Button
       id="btnCrearAFN"
      variant="success"
      size="lg"
      onClick={crearAFN}
      > Crear AFN
      </Button>
      <Button
       id="btnCancelarAFN"
      variant="danger"
      size="lg"
      onClick={ocultarAFNRender}
      > Cancelar
      </Button>
      </div>
    </>
  );
};
