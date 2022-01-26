const Evento = require('../models/Evento')

const getEventos= async (req,res)=>{
    const eventos = await Evento.find().populate('user','name');

    res.json({
        ok:true,
        msg:"getEventos",
        eventos
    })
}

const crearEvento = async(req,res)=>{
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.json({
            ok:true,
            evento:eventoGuardado
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador '+error
        })
    }

}

const actualizarEvento= async (req,res)=>{
    const eventId = req.params.id;

    try {
        const evento = await Evento.findById(eventId)
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'El id no existe'
            })
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio para editar este evento'
            })
        }

        const nuevoEvento ={
            ...req.body,
            user:req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventId,nuevoEvento,{new:true})

        return res.json({
            ok:true,
            evento:eventoActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

}

const eliminarEvento= async(req,res)=>{

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'El evento no existe'
            })
        }

        console.log("evento user: "+evento.user+ " uid: "+ uid)
        if(evento.user.toString() !== uid){
            return res.status(500).json({
                ok:false,
                msg:'No tiene privilegios para editar'
            })
        }

        await Evento.findByIdAndDelete(eventoId)

        return res.json({
            ok:true
        })
        
    } catch (error) {
        /* console.log(error) */
        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador '+error
        })
    }
}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}