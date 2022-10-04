import { useEffect } from 'react';
import { useState} from 'react';
import { Form, ModalTitle } from 'react-bootstrap';
import  Modal  from 'react-bootstrap/Modal';
import { VistaTransiciones } from './VistaTransiciones';
import { EstadoAFN } from './helpers/AFN';
import { Transicion } from './Transicion';





export const Estado = ({estado, agregaEstadoInicial,agregaEstadoFinal, numeroEstados, setTransicionesAFN}) => {

    const [transiciones, setTransiciones] = useState([]);
    const [esInicial, setEsInicial] = useState(false);
    const [esFinal, setEsFinal] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    useEffect(() => {
        if(transiciones.length > 0){
            setTransicionesAFN(estado.id, transiciones);
        }
    }, [transiciones])
    
    const ocultarModalHandler = () =>{
        setMostrarModal(false)
    }

    const mostrarModalHandler = () =>{
        setMostrarModal(true);
    }
    const estadoInicialHandler = ({target}) =>{
        if(!target.checked && esInicial){
            agregaEstadoInicial(-1)
        }
        setEsInicial(target.checked)
        if(target.checked == true)
            agregaEstadoInicial(estado.id);
        estado.esInicial = target.checked;
    }

    const transicionesHandler = (transicion) =>{
     let transicionEncontrada = transiciones.find( tran =>{
            return JSON.stringify(transicion.alfabeto) === JSON.stringify(tran.alfabeto) && transicion.estadoDestino.id == tran.estadoDestino.id;
        })
        !transicionEncontrada && setTransiciones([...transiciones, transicion]);
    }
        
    const estadoFinalHandler = ({target}) =>{
        setEsFinal(target.checked);
        agregaEstadoFinal(estado.id, target.checked);
        estado.esAceptacion = target.checked;
    }
    return (
        
        <div className="estadoDiv">

            <h1> Estado {estado.id}:  </h1>
                    
            <div>
                <img onClick={mostrarModalHandler} className='icon' src='https://img.icons8.com/fluency/344/add.png'/>Agregar transiciones
            </div>
            {
                transiciones.length > 0 && 
                (
                    <VistaTransiciones transiciones={transiciones} idEstado = { estado.id }/>
                )
            }
            <Form.Check 
                    onChange={estadoInicialHandler}
                    type="switch"
                    label="Estado inicial"
                    name="esInicial" 
                    id={"esInicial"+estado.id} 
                />
            
                <Form.Check 
                onChange ={estadoFinalHandler}
                type="switch"
                label =  "Estado de aceptación"
                name="esFinal"
                id={"esFinal"+estado.id}
                />
            <Modal show={mostrarModal} onHide = {ocultarModalHandler}>
                <Modal.Header>
                    <Modal.Title>Agregar transicion al estado {estado.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Transicion 
                    numeroEstados = {numeroEstados} 
                    ocultarModal = {ocultarModalHandler} 
                    agregarTransicionAFN = {transicionesHandler}
                    idEstado = {estado.id}/>
                </Modal.Body>
            </Modal>
        </div>
        )
}
