const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'El token es obligatorio'
        })
    }
    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_JW_SEED);

        req.uid = uid;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
    next()
}

module.exports = validarJWT