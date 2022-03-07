const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();

//Node server
const server = require('http').createServer(app);

module.exports.io = require('socket.io')(server);

require('./sockets/socket');


//path publico
const publichPath = path.resolve( __dirname, 'public' );

app.use(express.static(publichPath));

server.listen(process.env.PORT , (err) => {

    if (err) throw new Error(err);

    console.log( `Servidor corriendo en puerto:`, process.env.PORT);

});