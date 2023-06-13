const app = require('express')();
const httpServer = require('http').Server(app);
const port=4444;

const io = require("socket.io")(httpServer, {
    cors: {
      origin: '*',
    }
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });


io.on('connection', socket => {
  console.log('Nuevo jugador conectado');

  // Escuchar eventos de juego
  socket.on('ubicarTropa', tropa => {
    // Lógica para ubicar la tropa en el campo de batalla
    // ...

    // Emitir evento de actualización a todos los jugadores
    io.emit('actualizarCampo', campoDeBatalla);
  });

  socket.on('moverTropa', movimiento => {
    // Lógica para mover la tropa en el campo de batalla
    // ...

    // Emitir evento de actualización a todos los jugadores
    io.emit('actualizarCampo', campoDeBatalla);
  });

  socket.on('atacarTropa', ataque => {
    // Lógica para realizar el ataque entre tropas
    // ...

    // Emitir evento de actualización a todos los jugadores
    io.emit('actualizarCampo', campoDeBatalla);
  });

  // Manejo de desconexiones
  socket.on('disconnect', () => {
    console.log('Jugador desconectado');

    // Lógica para manejar la salida del jugador y actualizar el campo de batalla si es necesario
    // ...
  });
});


