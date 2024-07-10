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

        // Obtener el ciudadano por su ID
        const ciudadano = await ciudadanoDAO.findOne(id_ciudadano);
        // Verificar si el ciudadano existe
        if (!ciudadano) {
            return res.status(404).json({ success: false, message: 'Ciudadano no encontrado' });
        }

        // Obtener todas las quejas del ciudadano por su ID
        const quejasCiudadano = await quejaDAO.findAllbyCiudadanoID(id_ciudadano);

        let sumadorReputacion = 0;
        let quejasConPuntuacion = 0;
        let reputacion = 0;

        // Iterar sobre cada queja del ciudadano
        for (let i = 0; i < quejasCiudadano.length; i++) {
            if (quejasCiudadano[i].calificacion !== null) {
                sumadorReputacion += quejasCiudadano[i].calificacion;
                quejasConPuntuacion++;
            }
        }
        // Calcular la reputación promedio si hay quejas con calificación
        if (quejasConPuntuacion > 0) {
            reputacion = sumadorReputacion / quejasConPuntuacion;
        }
        // Actualizar la reputación del ciudadano en la base de datos
        ciudadano.reputacion = reputacion;
        const updatedreputacionCiuda = await ciudadanoDAO.update(ciudadano);

        if (!updatedreputacionCiuda) {
            return res.status(404).json({ message: 'No se pudo actualizar la reputación del ciudadano' });
        }
        // Devolver una respuesta exitosa con la reputación calculada y el ciudadano actualizado
        return res.status(200).json({ success: true, message: 'Reputación calculada correctamente.', ciudadano });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error interno del servidor'});
        
    }
};

const encontrarCiudadano = async (req, res) => {
    try {
        const {id_usuario} = req.body
        const ciudadano = await ciudadanoDAO.findOneByUserID(id_usuario)
        if (!ciudadano) {
            return res.status(404).json({ success: false, message: "Ciudadano no encontrado" });
        }
        return res.status(200).json({success:true,message:'ciudadano encontrado correctamente.', ciudadano})
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const ciudadanoController = { registrar, registrarGoogle, cambiarFoto, calcularReputacion, encontrarCiudadano };

export default ciudadanoController;
