const express = require('express');
const {validationResult} = require('express-validator')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req,res=express.response)=>{
    const {password,email} = req.body
    try {

        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'El email ya existe'
            })
        }
        usuario = new Usuario(req.body)

        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password,salt);

        await usuario.save();
        res.status(201).json({
        ok:true,
        uid:usuario.id,
        name:usuario.name
    })
    
    
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
    } 
}

const revalidarToken = (req,res=express.response)=>{
    const {uid,name} = req;

    const token = generarJWT(uid,name)

    res.json({
        ok:true,
        token
    })
}

const loginUsuario = async(req,res=express.response)=>{
    const {password,email} = req.body;

    try {
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario no existe'
            })
        }

        const validPassword = bcrypt.compareSync(password,usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            })
        }
        const token = await generarJWT(usuario._id,usuario.name);
        return res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:error
        })
    }
}

module.exports = {
    crearUsuario,
    revalidarToken,
    loginUsuario
}