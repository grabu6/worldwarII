import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tropa } from 'src/app/model/implementations/Tropa';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-joc',
  templateUrl: './joc.component.html',
  styleUrls: ['./joc.component.css']
})
export class JocComponent{
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  tropes: Tropa[] = [];
  selectedTropa: Tropa | null = null;
  posicioTropes: { tropa: Tropa, x: number, y: number }[] = [];

  statsTropa: { salut: number, defensa: number, atac: number, fiabilitat: number } = {
    salut: 0,
    defensa: 0,
    atac: 0,
    fiabilitat: 0
  };

  constructor(private socketService: ServiceService) {}
  
  ngOnInit(): void {
    this.socketService.onTorn((jugador)=>{
      if(jugador==='jugador1'){

      }else if(jugador==='jugador2'){
      }
    });
    
    this.socketService.onActualitzarCamp((data:any) => {
      this.posicioTropes = data;
      this.actualitzarCanvas();
    });
  
    this.crearTropes();
  }

  seleccionarTropa(tropa: Tropa): void {
    this.selectedTropa = tropa;
    this.statsTropa.salut = tropa.salut;
    this.statsTropa.defensa = tropa.defensa;
    this.statsTropa.atac = tropa.atac;
    this.statsTropa.fiabilitat = tropa.fiabilitat;
  }

  onCanvasClick(event: MouseEvent): void {
    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
  
    for (let i = this.posicioTropes.length - 1; i >= 0; i--) {
      const posicioTropes = this.posicioTropes[i];
      if (x >= posicioTropes.x && x <= posicioTropes.x + 30 && y >= posicioTropes.y && y <= posicioTropes.y + 30) {
        this.seleccionarTropa(posicioTropes.tropa);
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
        image.src = '../../../../assets/Imatges/aSoldier.png';
        image.onload = () => {
          ctx.drawImage(image, newX, newY, 30, 30);
        };
      }
    }
    this.socketService.moureTropa(direccio);
  }

  onMouseMove(event: MouseEvent): void {
    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    if (this.selectedTropa) {
      for (const posicionTropa of this.posicioTropes) {
        if (x >= posicionTropa.x && x <= posicionTropa.x + 30 && y >= posicionTropa.y && y <= posicionTropa.y + 30) {
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
        fiabilitat: 0
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
      image.src = '../../../../assets/Imatges/aSoldier.png';
      image.onload = () => {
        ctx.drawImage(image, x, y, 30, 30);
      };
  
      tropa.x = x;
      tropa.y = y;
  
      this.posicioTropes.push({ tropa: tropa, x: x, y: y });
  
      this.selectedTropa = tropa;
  
      tropa.jugada = true;

      this.socketService.ubicarTropa(tropa, x, y);
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
        image.src = '../../../../assets/Imatges/aSoldier.png';
        image.onload = () => {
          ctx.drawImage(image, posicioTropa.x, posicioTropa.y, 30, 30);
        };
      }
    }
  }
}