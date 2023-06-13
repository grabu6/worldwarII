import { ITropa } from "../interfaces/ITropa";

export class Tropa implements ITropa {
  salut: number;
  defensa: number;
  atac: number;
  fiabilitat: number;
  magia: number;
  x: number;
  y: number;

  constructor() {
    this.salut = 100;

    const maxPoints = 200;

    const minValue = 20;

    this.defensa = Math.floor(Math.random() * (150 - 2 * minValue) + minValue);
    this.atac = Math.floor(Math.random() * (150 - this.defensa - minValue) + this.defensa + 1);
    this.fiabilitat = Math.max(maxPoints - this.atac - this.defensa, minValue);
    
    this.magia = Math.max(this.defensa, Math.min(this.atac, Math.floor(Math.random() * (this.atac - this.defensa + 1)) + this.defensa));

    this.x = 0;
    this.y = 0;
  }
}
