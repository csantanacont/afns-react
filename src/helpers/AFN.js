export class EstadoAFN{
    // static cont = 0;
   
    constructor(id){
        this.id = id;
        this.nombre = "q"+String(id);
        this.transiciones = []; 
        this.esInicial = false;
        this.esAceptacion = false;
    }
     /* Verifica que la transicion que se intenta agregar, no se encuentre en las transiciones actuales
      antes de agregarla.*/
    agregarTransicion(transicion){
        let transicionEncontrada = this.transiciones.find( tran =>{
            return JSON.stringify(transicion.alfabeto) === JSON.stringify(tran.alfabeto) && transicion.estadoDestino.id == tran.estadoDestino.id;
        })
        !transicionEncontrada && this.transiciones.push(transicion);
    }
}

export class TransicionAFN {
    constructor(estadoInicial, simbolos, estadoFinal){
        this.alfabeto = simbolos;
        this.estadoOrigen = estadoInicial;
        this.estadoDestino = estadoFinal;
    }
}

export class CrearAFN{
    constructor(nombre, estados, inicial, final, transiciones, alfabeto){
        this.estados = estados || [];
        this.alfabeto = alfabeto || this.setAlfabeto();
        this.nombre = nombre || 'AUTOMATA ';
        this.transiciones = transiciones || [];
        this.estadoInicial = inicial==0?0:inicial || '';
        this.estadosAceptacion = final || [];
    }
    getInicial(){
        this.estados.map( estado => {
            if(estado.esInicial)
                return estado.id;
        })
    }
    setNombre(nombre){
        this.nombre = nombre;
    }
    setAlfabeto(){
        let alfabeto = [];
        /**Busca todos los caracteres de las transiciones y los guarda en un array */
        this.estados.map( estado => {
            let alfabetoN = estado.transiciones.map( transicion =>{
                alfabeto = alfabeto.concat(transicion.alfabeto);      
            })
        })
        /**Evita que existan repeticiones en el alfabeto generado */
        let alfabetoSet = new Set(alfabeto);
        alfabeto = [...alfabetoSet];
        return alfabeto;
    }
    agregarEstado(estado){
        // Verifica que el estado que se intenta agregar, no se encuentre en los estados actuales antes de agregarlo.
        const estadoEncontrado = this.estados.find( est => {
            return est.id == estado.id;
        })
        !estadoEncontrado && this.estados.push(estado);
    }
}