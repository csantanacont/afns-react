import { useState } from "react";
import  Modal  from "react-bootstrap/Modal"
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap"
export const VistaTransiciones = ({idEstado, transiciones}) => {
    const [mostrar, setMostrar] = useState(false)
    const mostrarModal = () => setMostrar(true);
    const ocultarModal = () => setMostrar(false);
  return (
    <>
    <div>
        <img 
        className='icon'
        src='https://img.icons8.com/ios-glyphs/344/list.png'
        onClick={mostrarModal}
        />Ver transiciones
    </div>

    <Modal show={mostrar} onHide={ocultarModal}>
    <Modal.Header closeButton>
    <Modal.Title>Transiciones del estado {idEstado}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Table bordered striped  className="truncate">
            <thead>
                <tr>
                <th>Estado origen</th>
                <th>Caracteres de transicion</th>
                <th>Estado destino</th>
                </tr>
            </thead>
            <tbody>
        {
            transiciones.map( (t,index) => (
                <tr key={index}>
                    <td>{t.estadoOrigen}</td>
                    {
                        JSON.stringify(t.alfabeto).length > 16?<td>{JSON.stringify(t.alfabeto).slice(0,16)+"..."+JSON.stringify(t.alfabeto[t.alfabeto.length -1])+"]"}</td>:<td>{JSON.stringify(t.alfabeto)}</td>
                    }
                    <td>{t.estadoDestino}</td>
                </tr>
            ))
        }
        </tbody>
        </Table>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="primary" onClick={ocultarModal}>
        OK
    </Button>
    </Modal.Footer>
    </Modal>
</>
  )
}
