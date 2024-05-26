// Aca hacer métodos complejos
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import quejaDAO from '../DAO/queja.js';
import estadoDAO from '../DAO/estado.js';

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

const cambiarFoto = async (req, res) => {
    try{
        const { foto, email } = req.body;
        const usuario = await usuarioDAO.findOneByEmail(email);
        await usuarioDAO.update({
            id: 1,
            email: usuario.email,
            password: usuario.password,
            nombre: usuario.nombre,
            apellido_paterno: usuario.apellido_paterno,
            apellido_materno: usuario.apellido_materno,
            foto: foto,
            rol_id: usuario.rol_id,
            sexo_id: usuario.sexo_id
        })

        return res.status(200).json({ success: true, message: 'Foto actualizada' });
    }catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};

const enviarQueja = async (req, res) => {
    try{
        const { asunto, descripcion, foto, ubicacion_descripcion, latitud, longitud, fecha, estado_id, ciudadano_id, municipalidad_id } = req.body;
        await quejaDAO.create({
            asunto: asunto,
            descripcion: descripcion,
            foto: foto,
            ubicacion_descripcion: ubicacion_descripcion,
            latitud: latitud,
            longitud: longitud,
            fecha: fecha,
            estado_id: estado_id,
            ciudadano_id: ciudadano_id,
            municipalidad_id: municipalidad_id
        })
        return res.status(200).json({ success: true, message: 'Foto actualizada' });

    }catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};

const verEstadoQueja = async (req, res) => {
    try{
        const { queja_id } = req.body;
        const queja = quejaDAO.findOne(queja_id);
        const estado = estadoDAO.findOne(queja.estado_id)
        return res.status(200).json({ success: true, Estado: estado.nombre });
    }catch(error){
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

const ciudadanoController = { registrar, getQuejas, cambiarFoto, enviarQueja, verEstadoQueja };

export default ciudadanoController;
