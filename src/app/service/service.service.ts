import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Tropa } from '../model/implementations/Tropa';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  
  private socket: Socket;

  private jugadorLocal: string = 'jugador1'; 

  constructor() {
    this.socket = io('http://localhost:3000');
    this.handleConnection();
  }

  private handleConnection(): void {
    this.socket.on('connect', () => {
      console.log('Conexión establecida con el servidor Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('Conexión perdida con el servidor Socket.IO');
    });
  }

  ubicarTropa(tropa: Tropa, x: number, y: number, imatge:string): void {
    this.socket.emit('ubicarTropa', { tropa, x, y,imatge });
  }

  moureTropa(tropa: Tropa, x: number, y: number): void {
    this.socket.emit('moureTropa', { tropa, x, y });
  }

  atacarTropa(): void {
    this.socket.emit('atacarTropa');
  }

  onTorn(callback: (jugador: string) => void): void {
    this.socket.on('torn', callback);
  }

  onActualitzarCamp(callback: any): void {
    this.socket.on('actualitzarCamp', callback);
  }

  tornCompletat(): void {
    this.socket.emit('tornCompletat');
  }

  obtenirJugador(): string {
    return this.jugadorLocal;
  }
}
