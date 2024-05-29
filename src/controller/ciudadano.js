// Aca hacer métodos complejos
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';

const registrar = async (req, res) => {
    try {
        const { email, password, nombre, apellido_paterno, apellido_materno, dni, sexo, foto, numero } = req.body;
        const ciudadano = await usuarioDAO.findOneByEmail(email);

        if (ciudadano) {
            return res.status(401).json({ success: false, message: 'El usuario ya ha sido registrado. Intenté con otro correo.' });
        } else {
            const usuario = await usuarioDAO.create({
                nombre: nombre,
                email: email,
                password: password,
                foto: foto,
                rol_id: 1,
                sexo_id: sexo,
                apellido_paterno: apellido_paterno,
                apellido_materno: apellido_materno,
            })

            const id = usuario.id
            await ciudadanoDAO.create({
                dni: dni,
                numero: numero,
                usuario_id: id
                
            })
            return res.status(200).json({ success: true, message: 'Usuario creado exitosamente' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const cambiarFoto = async (req, res) =>{
    console.log("Foto cambiada");
};

const ciudadanoController = { registrar , cambiarFoto};

export default ciudadanoController;
