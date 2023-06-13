const app = require('express')();
const httpServer = require('http').Server(app);
const port = 3000;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*',
  }
});

const imagenJugador2 = '../../../../assets/Imatges/enemySoldier.png';


httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let jugadores = {};
let turnoActual = 'jugador1';
let jugadorCount = 0;
let jugadoresListos = 0;

io.on('connection', socket => {
  console.log('Nuevo jugador conectado');

  jugadorCount++;

  const jugador = jugadorCount === 1 ? 'jugador1' : 'jugador2';

  socket.on('ubicarTropa', data => {
    console.log("Tropa ubicada:", data.tropa);
    console.log("Jugador:", jugador, "con id:", socket.id);

    jugadores[socket.id] = {
      tropa: data.tropa,
      x: data.x,
      y: data.y,
      imatge: imagenJugador2
    };
    console.log(imagenJugador2);
    io.emit('actualitzarCamp', Object.values(jugadores));

    if (jugadorCount === 2) {
      jugadoresListos++;
      if (jugadoresListos === 2) {
        io.emit('torn', turnoActual);
      }
    }
  });

  socket.on('moureTropa', data => {
    console.log("Tropa moguda:", data.tropa);
    console.log("Jugador:", jugador, "con id:", socket.id);

    jugadores[socket.id] = {
      tropa: data.tropa,
      x: data.x,
      y: data.y
    };
    io.emit('actualitzarCamp', Object.values(jugadores));
  });

  socket.on('atacarTropa', atac => {
    console.log("Tropa atacada");
    console.log("Jugador:", jugador, "con id:", socket.id);

    io.emit('actualitzarCamp', Object.values(jugadores));
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado');
    console.log("Jugador:", jugador, "con id:", socket.id);

    delete jugadores[socket.id];

    io.emit('actualitzarCamp', Object.values(jugadores));
  });

});
