const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {
    const payload = { uid, name };
    try {
        const token = jwt.sign(payload, process.env.SECRET_JW_SEED, {
            expiresIn: '2h'})
        return token;
    } catch (error) {
        console.log(err)
        return 'No se pudo generar el token capo';
    }
}

module.exports = {
    generarJWT
};