const { response } = require("express");
const { validationResult } = require("express-validator");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado.'
            });
        }
        const usuario = new Usuario( req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar jwt
        const token = await generarJWT( usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok : false,
            msg: 'Hable con el administrador de BD'
        });
    }

    
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const usuarioDb = await Usuario.findOne({email});

        if( !usuarioDb ) {
            return res.status(404).json({
                ok : false,
                msg: 'Email no encontrado'
            });
        }

        //Validar password.
        const validPassword = bcrypt.compareSync(password, usuarioDb.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok : false,
                msg: 'Contarseña no valida'
            });
        }

        //Generar jwt
        const token = await generarJWT( usuarioDb.id )

        res.json({
            ok: true,
            usuarioDb,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok : false,
            msg: 'Hable con el administrador de BD'
        });
    }

}

const renewToken = async (req, res = response ) => {
    const uid = req.uid;
    
    const token = await generarJWT( uid );

    const usuarioDb = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuarioDb,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}