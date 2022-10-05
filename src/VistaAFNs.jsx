import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { FcCheckmark } from "react-icons/fc"
import { GrClose } from "react-icons/gr"
import { BsArrowReturnRight } from "react-icons/bs"

export const VistaAFNs = ({automatas, idx}) => {

  let afn = automatas[idx];
  let estadosDestino = [];
  
  return (
    <>
    <Table bordered striped hover  className="tabla">
      <thead>
        <tr>
          <th>ESTADO</th>
          {
            afn.alfabeto.map( a => (<th>{a}</th>))
          }
          <th> Es de aceptacion </th>
        </tr>
      </thead>
      <tbody>
          {afn.estados.map( e => {
            return(
              <tr>
                {
                  e.id === afn.estadoInicial ? <td > <BsArrowReturnRight></BsArrowReturnRight> {e.id}</td> : <td > {e.id}</td>
                }
                
                {
                  afn.alfabeto.map( a => {    
                    estadosDestino = [];              
                    e.transiciones.map( t => {
                      t.alfabeto.includes(a) && estadosDestino.push(t.estadoDestino)
                    })
                    return(<td>{
                      JSON.stringify(estadosDestino)
                      }</td>)
                    
                  } )
                }
                {
                  afn.estadosAceptacion.includes(e.id) ? <td ><FcCheckmark></FcCheckmark></td> : <td ><GrClose></GrClose></td>
                }
              </tr>
            )
          })}
      </tbody>
    </Table>
    </>
    
    
  )
}
