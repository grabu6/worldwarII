const app = require('express')();
const httpServer = require('http').Server(app);
const port=3000;

const io = require("socket.io")(httpServer, {
    cors: {
      origin: '*',
    }
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  let jugadores = {}; // Almacena la información de los jugadores conectados

  io.on('connection', socket => {
    console.log('Nuevo jugador conectado');
  
    socket.on('ubicarTropa', data => {
      console.log("Tropa ubicada:", data.tropa);
      console.log("Jugador:", socket.id);
  
      jugadores[socket.id] = {
        tropa: data.tropa,
        x: data.x,
        y: data.y
      };
  
      io.emit('actualitzarCamp', Object.values(jugadores));
    });
  
    socket.on('moureTropa', data => {
      console.log("Tropa moguda:", data.direccio);
      console.log("Jugador:", socket.id);
  
      if (jugadores[socket.id]) {
        jugadores[socket.id].x = data.x;
        jugadores[socket.id].y = data.y;
      }
  
      io.emit('actualitzarCamp', Object.values(jugadores));
    });
  
    socket.on('atacarTropa', atac => {
      console.log("Tropa atacada");
      console.log("Jugador:", socket.id);
    
      io.emit('actualitzarCamp', Object.values(jugadores));
    });
  
    socket.on('disconnect', () => {
      console.log('Jugador desconectado');
      console.log("Jugador:", socket.id);
  
      delete jugadores[socket.id];
  
      io.emit('actualitzarCamp', jugadores);
    });
  });
