/*
    route: /api/events

*/


const { Router } = require("express");
const validarJWT = require('../middlewares/validar-jwt')
const {crearEvento,eliminarEvento,actualizarEvento,getEventos} = require('../controllers/events')
const router = Router();
const {check} = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos');
const { isDate } = require("../helpers/isDate");

router.use(validarJWT)

router.get('/',validarJWT,getEventos)
router.post('/',validarJWT,[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','La fecha es obligatoria').custom(isDate),
    check('end','La fecha de fin es obligatoria').custom(isDate),
    validarCampos
],crearEvento)
router.put('/:id',validarJWT,actualizarEvento)
router.delete('/:id',validarJWT,eliminarEvento)

module.exports = router;