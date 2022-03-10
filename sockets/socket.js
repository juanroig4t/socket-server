const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');
    
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])

    if ( !valido) {
        return client.disconnect();
    }

    usuarioConectado(uid);

    //Sala Globar
    client.join(uid);
    //mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje( payload );
        io.to( payload.para ).emit('mensaje-personal', payload );
    });

    client.on('disconnect', () => {
         usuarioDesconectado(uid);
    });

    
    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);
    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // });


});
