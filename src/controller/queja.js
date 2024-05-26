import quejaDAO from '../DAO/queja.js';
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import municipalidadDAO from '../DAO/municipalidad.js';

const agregarQueja = async (req, res) => {
    const { asunto, descripcion, foto, ubicacion_descripcion, latitud, longitud, municipalidad, email } = req.body;
    try {
        const usuario = await usuarioDAO.findOneByEmail(email);
        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const ciudadano = await ciudadanoDAO.findOne(usuario.id);
        if (!ciudadano) {
            return res.status(404).json({ success: false, message: "Ciudadano no encontrado" });
        }

        console.log("Usuario ID:", usuario.id);
        console.log("Ciudadano ID:", ciudadano.id);

        const queja = await quejaDAO.create({
            asunto: asunto,
            descripcion: descripcion,
            foto: foto,
            ubicacion_descripcion: ubicacion_descripcion,
            latitud: latitud,
            longitud: longitud,
            fecha: new Date(),
            estado_id: 1,
            ciudadano_id: ciudadano.id,
            municipalidad_id: municipalidad
        });

        return res.status(200).json({ success: true, message: "Queja enviada", data: queja });
    } catch (error) {
        console.error("Error al agregar queja:", error); // Agregar logs detallados
        return res.status(500).json({ success: false, message: error.message });
    }
};

const actualizarQueja = async (req, res) => {
    try{
        const { queja_id, estado_id } = req.body;
        const queja = await quejaDAO.findOne(queja_id);
        
        await quejaDAO.update({
            id: queja.id,
            asunto: queja.asunto,
            descripcion: queja.descripcion,
            foto: queja.foto,
            ubicacion_descripcion: queja.ubicacion_descripcion,
            latitud: queja.latitud,
            longitud: queja.longitud,
            fecha: queja.fecha,
            estado_id: estado_id,
            ciudadano_id: queja.ciudadano_id,
            municipalidad_id: queja.municipalidad_id
        })

        return res.status(200).json({ success: true, message: 'Actualización realizada con exito' });
    }catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};

const encontrarUbicacion = async (req, res) => {
    try{
        const { queja_id } = req.body;
        const queja = await quejaDAO.findOne(queja_id);
        const ubicacion = queja.ubicacion_descripcion;

        return res.status(200).json({ success: true, message: ubicacion });
    }catch(erro){
        return res.status(500).json({ success: false, message: error.message });
    }
};

const encontrarDistrito = async (req, res) => {
    try{
        const { queja_id } = req.body;
        const queja = await quejaDAO.findOne(queja_id);
        const municipalidad_id = queja.municipalidad_id;
        const municipalidad = await municipalidadDAO.findOne(municipalidad_id);

        return res.status(200).json({ success: true, message: municipalidad.nombre });
    }catch(erro){
        return res.status(500).json({ success: false, message: error.message });
    }
};

const quejaController = { agregarQueja, actualizarQueja, encontrarDistrito, encontrarUbicacion }

export default quejaController;
