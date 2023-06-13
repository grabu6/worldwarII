import { ITropa } from "../interfaces/ITropa";

export class Tropa implements ITropa{
    salut: number;
    defensa: number;
    atac: number;
    fiabilitat: number;
    x: number;
    y: number;
    jugada: boolean;
    constructor() {
        this.salut = 100;
        let maxValor = 99;  
        this.defensa = Math.floor(Math.random() * maxValor) + 1;
        maxValor -= this.defensa;
        this.atac = Math.floor(Math.random() * maxValor) + 1;
        maxValor -= this.atac;
        this.fiabilitat = maxValor;
        this.x = 0;
        this.y = 0;
        this.jugada=false;
      }
    
      
}