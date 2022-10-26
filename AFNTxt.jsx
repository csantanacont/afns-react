import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { Estado } from './src/Estado';
import { EstadoAFN, CrearAFN, TransicionAFN  } from './src/helpers/AFN';
import Swal from 'sweetalert2';

export const AFNTxt = ({ocultarAFNRenderTXT, enviarAFN}) => {
  
  const [numEstados, setnumEstados] = useState(-1);
  
  const handleCantidadEstados = (e) =>{
    const {value} = e.target;
    setnumEstados(Number(value));
  }
  const crearEstados = () =>{
    const numEstadosInput = document.getElementById("cantidadEstados");
    const inicialInput = document.getElementById("estadoInicial");
    const finalesInput = document.getElementById("estadosFinales");
    let inicial = Number(inicialInput.value);
    let finales = finalesInput.value.split(",").map(Number);

    let estados = [];
    for(let i=0; i<Number(numEstadosInput.value); i++){
       estados.push(new EstadoAFN(i));
    } 
    estados[inicial].esInicial = true;
    finales.map(i => {estados[i].esAceptacion = true;})
    
    return estados;

  }
  const crearTransiciones = (estados) => {
    const transicionesInput = document.getElementById("transiciones");
    let transicionesFinales = [];
    let transiciones = transicionesInput.value.split("\n");
    transiciones = transiciones.map( t =>{
        let tAux = [];
        tAux = t.split(",");
        tAux[0] = Number(tAux[0]);
        tAux[2] = Number(tAux[2]);
        return tAux;
    } )

    transiciones.map( t =>{
      let tAux = new TransicionAFN(t[0], t[1], t[2]);
      estados[t[0]].agregarTransicion(tAux);
      transicionesFinales.push(tAux);
    })
    console.log(estados, transiciones)
    return {
      estadosAFN: estados,
      transicionesAFN: transiciones
    }; 
  }

  const crearAlfabeto = () =>{
    const alfabetoInput = document.getElementById("alfabeto");
    let alfabeto = alfabetoInput.value.split(",");
  }
  const crearAFN = async (e) =>{
    e.preventDefault();
    const inicialInput = document.getElementById("estadoInicial");
    const finalesInput = document.getElementById("estadosFinales");
    const nombreInput = document.getElementById("nombre");

    let estadoInicial = Number(inicialInput.value);
    let estadosFinales = finalesInput.value.split(",").map(Number);
    let estados = crearEstados();
    let alfabeto = crearAlfabeto();
    let {estadosAFN,transicionesAFN} =   crearTransiciones(estados);

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
          e : estadosAFN,
          sigma : alfabeto,
          t : transicionesAFN,
          nombre: inputValue.value
        }
        console.log(afnFinal);
        enviarAFN(afnFinal);
      }
    )
    // let nombre = nombreInput.value;
    // let afnNuevo = new CrearAFN(nombre,estadosAFN, estadoInicial, estadosFinales, transicionesAFN);

    // enviarAFN(afnNuevo);
  }
  return (
    <div>
        <br/>
      <h1>CREAR UN AUTOMATA FINITO DETERMINISTA</h1>
        <Form validated onSubmit={crearAFN}>
            <Row className="filaDatosAFNTXT" id='fila1'>
                <Col>
                    <Form.Group>
                        <Form.Label> Ingresa la cantidad de estados: </Form.Label>
                        <Form.Control type='number' size='sm' id="cantidadEstados" required min="1" onChange={handleCantidadEstados}></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Es necesario ingresar un valor mayor o igual a 1
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label> Ingresa los caracteres del alfabeto: </Form.Label>
                        <Form.Control type='text' size='sm' id="alfabeto" required></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Es necesario ingresar el alfabeto del AFN. Los simbolos deben estar separados por una coma (,)
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="filaDatosAFNTXT" id='fila2'>
                <Col>
                        <Form.Group>
                            <Form.Label> Ingresa el estado inicial: </Form.Label>
                            <Form.Control type='number' size='sm' id="estadoInicial" required min="0" 
                            max={numEstados -1}></Form.Control>
                             <Form.Control.Feedback type="invalid">
                              Debes ingresar un estado inicial valido y existente. Prueba un estado que este entre 0 y {numEstados -1}
                            </Form.Control.Feedback>
                        </Form.Group>
                       
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label> Ingresa los estados finales: </Form.Label>
                            <Form.Control type='text' size='sm' id="estadosFinales" required></Form.Control>
                            <Form.Control.Feedback type="invalid">
                              Debes ingresar los valores de estado final. Los estados deben estar separados por una coma (,)
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Col>
            </Row>
            <Row id="fila3">
                <Form.Group>
                    <Form.Label> Ingresa las transiciones: </Form.Label>
                    <Form.Control type='text' as="textarea" rows={5} size='sm'id="transiciones" required></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar transiciones para el automata.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            {/* <Row id="fila4">
                <Form.Group>
                    <Form.Label> Ingresa un nombre para el AFN: </Form.Label>
                    <Form.Control type='text' size='sm'id="nombre" defaultValue={"AUTOMATA"} required></Form.Control>
                </Form.Group>
            </Row> */}

            <div className="botonesInicio">
                <Button
                id="btnCrearAFN"
                variant="success"
                size="lg"
                type='submit'
                > Crear AFN
                </Button>
                <Button
                id="btnCancelarAFN"
                variant="danger"
                size="lg"
                onClick={ocultarAFNRenderTXT}
                > Cancelar
                </Button>
            </div>
            
            
        </Form>
       
    </div>
  )
}
