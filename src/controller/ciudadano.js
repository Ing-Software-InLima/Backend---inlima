// Aca hacer métodos complejos
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import quejaDAO from '../DAO/queja.js';

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

const registrarGoogle = async (req, res) => {
    try {
        const { email, nombre, apellido_paterno, apellido_materno, dni, sexo, foto, numero } = req.body;
        const ciudadano = await usuarioDAO.findOneByEmail(email);

        if (ciudadano) {
            return res.status(401).json({ success: false, message: 'El usuario ya ha sido registrado. Intenté con otro correo.' });
        } else {
            const usuario = await usuarioDAO.create({
                nombre: nombre,
                email: email,
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

const cambiarFoto = async (req, res) => {
    console.log("Foto cambiada");
};

const calcularReputacion = async (req, res) => {
    try {
        const { id_ciudadano } = req.body;
        
        // Obtener el ciudadano
        const ciudadano = await ciudadanoDAO.findOne(id_ciudadano);

        // Obtener todas las quejas del ciudadano
        const quejasCiudadano = await quejaDAO.findAllbyCiudadanoID(id_ciudadano);
        
        let Sumadorreputacion = 0;
        let quejasConPuntuacion = 0;
        let reputacion = 0;
        
        // Iterar sobre cada queja del ciudadano
        for (let i = 0; i < quejasCiudadano.length; i++) {
            if (quejasCiudadano[i].calificacion !== null) {
                Sumadorreputacion += quejasCiudadano[i].calificacion;
                quejasConPuntuacion++;
            }
        }
        
        // Calcular la reputación promedio si hay quejas con calificación
        if (quejasConPuntuacion > 0) {
            reputacion = Sumadorreputacion / quejasConPuntuacion;
        }

        ciudadano.reputacion = reputacion

        const updatedreputacionCiuda = await ciudadanoDAO.update(ciudadano);

        if (!updatedreputacionCiuda) {
            return res.status(404).json({ message: 'No se pudo actualizar la reputación del ciudadano' });
        }

        // Devolver la respuesta con la reputación calculada
        return res.status(200).json({ success: true, message: 'Reputacion calculada correctamente.', ciudadano });
    } catch (error) {
        // Manejar errores
        return res.status(500).json({ success: false, message: error.message });
    }
};



const ciudadanoController = { registrar, registrarGoogle, cambiarFoto, calcularReputacion };

export default ciudadanoController;
