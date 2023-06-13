import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tropa } from 'src/app/model/implementations/Tropa';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-joc',
  templateUrl: './joc.component.html',
  styleUrls: ['./joc.component.css']
})
export class JocComponent implements OnInit {
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  tropes: Tropa[] = [];
  jugadorActual: string = 'jugador1';
  tropaAtacant: Tropa | null = null;
  tropaObjectiu: Tropa | null = null;
  imagenJugador1: string = '../../../../assets/Imatges/aSoldier.png';
  imagenJugador2: string = '../../../../assets/Imatges/enemySoldier.png';
 


  potJugar: boolean = true;
  haTirat: boolean = false;
  selectedTropa: Tropa | null = null;
  posicioTropes: { tropa: Tropa; x: number; y: number, imatge:string }[] = [];

  statsTropa: {
    salut: number;
    defensa: number;
    atac: number;
    fiabilitat: number;
    magia: number;
  } = {
    salut: 0,
    defensa: 0,
    atac: 0,
    fiabilitat: 0,
    magia:0
  };

  constructor(private socketService: ServiceService) {}

  ngOnInit(): void {
    this.socketService.onTorn((jugador) => {
      this.potJugar = jugador === this.socketService.obtenirJugador();
      this.haTirat = false;
      this.jugadorActual = jugador;
      console.log(jugador);
      console.log('Torn del jugador: ', jugador);
      console.log('Puede jugar: ', this.potJugar);
    });

    this.socketService.onActualitzarCamp((data: any) => {
      this.posicioTropes = data;
      this.actualitzarCanvas();
    });

    this.crearTropes();
  }

  seleccionarTropaAtacant(tropa: Tropa): void {
    this.tropaAtacant = tropa;
    console.log('Tropa atacant seleccionada: ', tropa);
  }

  seleccionarTropaObjectiu(tropa: Tropa): void {
    this.tropaObjectiu = tropa;
    console.log('Tropa objectiu seleccionada: ', tropa);
  }

  realitzarAtac(): void {
    if (this.tropaAtacant && this.tropaObjectiu) {
      console.log('Atacant: ', this.tropaAtacant, 'Objectiu: ', this.tropaObjectiu);
  
      const distanciaX = this.tropaAtacant.x - this.tropaObjectiu.x;
      const distanciaY = this.tropaAtacant.y - this.tropaObjectiu.y;
      const distancia = Math.sqrt(Math.pow(distanciaX, 2) + Math.pow(distanciaY, 2));
  
      if (distancia < 120) {
        const multiplicador=150;
        const A = this.tropaAtacant.atac; 
        const M = this.tropes.length > 0 ? this.mitjanaAtacTropesReserva() : 1; 
        const F = this.tropaAtacant.fiabilitat; 
        const R = Math.random();
        let forcaAtac = A * R *  (F / 100) / M; 
        forcaAtac *= multiplicador;
        const D = this.tropaObjectiu.defensa; 

        const impacteAtac = 50+forcaAtac / D; 

        this.tropaObjectiu.salut -= impacteAtac;

        console.log('Tropa atacant:', this.tropaAtacant);
        console.log('Tropa objectiu:', this.tropaObjectiu);
        console.log('Dany causat:', impacteAtac);

        if (this.tropaObjectiu.salut < 0) {
          const index = this.posicioTropes.findIndex(posicio => posicio.tropa === this.tropaObjectiu);
          if (index !== -1) {
            this.posicioTropes.splice(index, 1);
            console.log('La tropa objectiu ha estat eliminada.');
            
            this.socketService.eliminarTropa(this.tropaObjectiu);

            this.tropaAtacant.x = this.tropaObjectiu.x;
            this.tropaAtacant.y = this.tropaObjectiu.y;
          }
        }
      } else {
        console.log('La distància entre les tropes és superior a 120. No es pot realitzar l\'atac.');
      }
    }
  }

  onCanvasClick(event: MouseEvent): void {
    console.log('Click on canvas');
    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    for (let i = this.posicioTropes.length - 1; i >= 0; i--) {
      const posicioTropes = this.posicioTropes[i];

        if (this.tropaAtacant === null) {
          this.seleccionarTropaAtacant(posicioTropes.tropa);
        } else if (this.tropaObjectiu === null) {
          this.seleccionarTropaObjectiu(posicioTropes.tropa);
          break;
        
      }
    }
  }

  moureTropa(direccio: string): void {
    if (this.selectedTropa) {
      const canvas = this.canvasElement.nativeElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        ctx.clearRect(this.selectedTropa.x, this.selectedTropa.y, 30, 30);
  
        let newX = this.selectedTropa.x;
        let newY = this.selectedTropa.y;
  
        switch (direccio) {
          case 'amunt':
            newY -= 10;
            break;
          case 'avall':
            newY += 10;
            break;
          case 'esquerra':
            newX -= 10;
            break;
          case 'dreta':
            newX += 10;
            break;
          case 'diagonal_superior_esquerra':
            newX -= 10;
            newY -= 10;
            break;
          case 'diagonal_superior_dreta':
            newX += 10;
            newY -= 10;
            break;
          case 'diagonal_inferior_esquerra':
            newX -= 10;
            newY += 10;
            break;
          case 'diagonal_inferior_dreta':
            newX += 10;
            newY += 10;
            break;
        }
  
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const troopSize = 30;
  
        if (newX < 0) {
          newX = 0;
        } else if (newX + troopSize > canvasWidth) {
          newX = canvasWidth - troopSize;
        }
  
        if (newY < 0) {
          newY = 0;
        } else if (newY + troopSize > canvasHeight) {
          newY = canvasHeight - troopSize;
        }
  
        this.selectedTropa.x = newX;
        this.selectedTropa.y = newY;
  
        const image = new Image();
        const imageSrc =
          this.jugadorActual === 'jugador1'
            ? this.imagenJugador1
            : this.imagenJugador2;
        image.src = imageSrc;
        image.onload = () => {
          ctx.drawImage(image, newX, newY, 30, 30);
        };
  
        const tropa = this.selectedTropa;
        const x = newX;
        const y = newY;
        this.socketService.moureTropa(tropa, x, y);
      }
    }
  }
  
  onMouseMove(event: MouseEvent): void {
    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    if (this.selectedTropa) {
      for (const posicionTropa of this.posicioTropes) {
        if (
          x >= posicionTropa.x &&
          x <= posicionTropa.x + 30 &&
          y >= posicionTropa.y &&
          y <= posicionTropa.y + 30
        ) {
          this.statsTropa.salut = posicionTropa.tropa.salut;
          this.statsTropa.defensa = posicionTropa.tropa.defensa;
          this.statsTropa.atac = posicionTropa.tropa.atac;
          this.statsTropa.fiabilitat = posicionTropa.tropa.fiabilitat;
          break;
        }
      }
    } else {
      this.statsTropa = {
        salut: 0,
        defensa: 0,
        atac: 0,
        fiabilitat: 0,
        magia:0
      };
    }
  }

  crearTropes() {
    for (let i = 0; i < 10; i++) {
      const tropa = new Tropa();
      this.tropes.push(tropa);
    }
  }

  ubicarTropa(tropa: Tropa, x: number, y: number): void {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const image = new Image();
      const imageSrc =this.imagenJugador1;
      image.src = imageSrc;
      image.onload = () => {
        ctx.drawImage(image, x, y, 30, 30);
      };

      tropa.x = x;
      tropa.y = y;

      this.posicioTropes.push({ tropa: tropa, x: x, y: y, imatge: '' });

      const index = this.tropes.findIndex((t) => t.atac === tropa.atac);
      if (index !== -1) {
        this.tropes.splice(index, 1);
      }

      this.selectedTropa = tropa;

      this.socketService.ubicarTropa(tropa, x, y,'');
    }
  }

  onDragStart(event: DragEvent, tropa: Tropa): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(tropa));
  }

  onDragOverCanvas(event: DragEvent): void {
    event.preventDefault();
  }

  onDropCanvas(event: DragEvent): void {
    event.preventDefault();
    const tropaData = event.dataTransfer?.getData('text/plain');
    if (tropaData) {
      const tropa = JSON.parse(tropaData);
      const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;
      this.ubicarTropa(tropa, x, y);
      console.log(tropa);
      const tropa2 = Object.assign({}, tropa);
      tropa2.x += 20;
      this.ubicarTropa(tropa2, x + 20, y);
      console.log(tropa2);
      tropa.jugada = true;
    }
  }

  actualitzarCanvas(): void {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const posicioTropa of this.posicioTropes) {
        const image = new Image();
        const imageSrc =posicioTropa.imatge || this.imagenJugador1;
        image.src = imageSrc;
        image.onload = () => {
          ctx.drawImage(image, posicioTropa.x, posicioTropa.y, 30, 30);
        };
      }
    }
  }

  mitjanaAtacTropesReserva() {
    let sumaAtac = 0;
    for (const tropaReserva of this.tropes) {
      sumaAtac += tropaReserva.atac;
    }
    return sumaAtac / this.tropes.length;
  }
}

