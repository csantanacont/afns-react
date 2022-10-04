import { useState } from "react";
import { Button, Form } from "react-bootstrap"
import { TransicionAFN } from "./helpers/AFN";

export const Transicion = ({numeroEstados, ocultarModal, agregarTransicionAFN, idEstado}) => {

  const [estadoOrigen, setEstadoOrigen] = useState(-1);
  const [estadoDestino, setEstadoDestino] = useState(-1);
  const [alfabeto, setAlfabeto] = useState([]);

  const [validated, setValidated] = useState(false);

  const agregarTransicion = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    e.preventDefault();
    const origen = document.getElementById("estadoOrigen");
    const destino = document.getElementById("estadoDestino");
    const expresionAlfabeto = document.getElementById("alfabeto");

    console.log(estadoOrigen, estadoDestino, alfabeto);
    
    agregarEstadoOrigen(Number(origen.value));
    agregarEstadoDestino(Number(origen.value));
    const alfabetoT = agregarAlfabeto(expresionAlfabeto.value);

    let t = new TransicionAFN(Number(origen.value), alfabetoT, Number(destino.value));
    agregarTransicionAFN(t);
    ocultarModal();
  }

  const agregarEstadoOrigen = (origen) =>{
    setEstadoOrigen(origen);
  }
  const agregarEstadoDestino = (destino) =>{
    setEstadoDestino(destino);
  }
  const agregarAlfabeto = (expresion) => {
    let alfabetoObtenido = [];
    if(expresion.length > 1 && expresion.includes(',')){
      /**Caso donde hay diferentes caracteres */
      alfabetoObtenido = expresion.split(',');
    }
    else if(expresion.length > 1 && expresion.includes('-')){
      /**Caso donde hay un rango de caracteres */
      let aux = expresion.split('-');
      for(let i=aux[0].charCodeAt(); i<=aux[1].charCodeAt(); i++){
          alfabetoObtenido.push(String.fromCharCode(i));
      }
    }
    else{
      /**Caso donde solo es un caracter */
      alfabetoObtenido.push(expresion[0]);
    }
    alfabetoObtenido = new Set(alfabetoObtenido);
    alfabetoObtenido = [...alfabetoObtenido]
    setAlfabeto(alfabetoObtenido);
    return alfabetoObtenido;
  }
  return (
    <>
        <Form validated onSubmit={agregarTransicion}> 
            <Form.Group>
                <Form.Label> Estado de origen: </Form.Label>
                
                <Form.Control 
                type="number"
                value={idEstado}
                placeholder="Estado origen"
                size="sm"
                disabled
                id="estadoOrigen"/>
                 <div>
                 <Form.Label> Ingresa estado destino: </Form.Label>
                <Form.Control 
                type="number"
                placeholder="Estado destino"
                size="sm"
                min="0"
                max={numeroEstados-1}
                id="estadoDestino"
                required
                
                />
                <Form.Control.Feedback type="invalid">
                El estado destino no puede estar vacio y debe estar en el conjunto de estados definidos al incio.
                </Form.Control.Feedback>
                 </div>
                 <div>
                <Form.Label> Ingresa los caracteres de la transición: </Form.Label><br/>
                <Form.Control
                type="text"
                placeholder="Caracteres de la transición "
                id="alfabeto"
                required/>
                <Form.Control.Feedback type="invalid">
                Los caracteres de la transicion no pueden estar vacios
                </Form.Control.Feedback>
                <Form.Text muted> Transicion con un solo caracter, ingresa el caracter únicamente. Ej. a<br/>
                Transición con diferentes caracteres, separalos con una coma. Ej. a,c,d <br/>
                Transición con un rango de caracteres, separalos con un guión. Ej. 0-9
                </Form.Text>            
                </div>    
                <br/><br/>
            </Form.Group>
            <Button 
            variant="success"
            type="submit"
            >
              Agregar transicion
            </Button>
        </Form>
    </>
  )
}
