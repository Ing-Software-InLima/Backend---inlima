// Aca hacer métodos complejos
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import quejaDAO from '../DAO/queja.js';

const registrar = async (req, res) => {
    try {
        const { email, password, nombre, apellido_paterno, apellido_materno, dni, sexo, foto } = req.body;
        const ciudadano = await usuarioDAO.findOneByEmail(email);

        if (ciudadano) {
            return res.status(401).json({ success: false, message: 'El usuario ya ha sido registrado. Intenté con otro correo.' });
        } else {
            const usuario = await usuarioDAO.create({
                nombre: nombre,
                email: email,
                password: password,
                foto: foto,
                rol_id: 2,
                sexo_id: sexo
            })

            const id = usuario.id
            await ciudadanoDAO.create({
                dni: dni,
                apellido_paterno: apellido_paterno,
                apellido_materno: apellido_materno,
                usuario_id: id
            })
            return res.status(200).json({ success: true, message: 'Usuario creado exitosamente' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getQuejas = async (req, res) => {
    try {
        //const { ciudadano_id } = req.body;
        const { email } = req.body;
        const usuario = await usuarioDAO.findOneByEmail(email);
        const ciudadano = await ciudadanoDAO.findOneByUserID(usuario.id);
        const quejas = await quejaDAO.findAllbyCiudadanoID(ciudadano.id);
        //const quejas = await quejaDAO.findAllbyCiudadanoID(ciudadano_id);
        return res.status(200).json(quejas);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const ciudadanoController = { registrar, getQuejas };

export default ciudadanoController;
