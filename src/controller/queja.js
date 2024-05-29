import quejaDAO from '../DAO/queja.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import municipalidadDAO from '../DAO/municipalidad.js';
import jwt from 'jsonwebtoken'
const agregarQueja = async (req, res) => {
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const { id } = decoded;

        const { asunto, descripcion, foto, ubicacion_descripcion, latitud, longitud, municipalidad } = req.body;

        const ciudadano = await ciudadanoDAO.findOneByUserID(id);
        if (!ciudadano) {
            return res.status(404).json({ success: false, message: "Ciudadano no encontrado" });
        }

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

const obtenerQuejasFiltradas = async (req, res) => {
    try {
        const {asuntos, municipalidad} = req.body;
        const resultados = await quejaDAO.findFiltered(asuntos, municipalidad);
        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener las quejas:', error);
        res.status(500).json({ error: 'Error al obtener las quejas' });
    }
};

const obtenerQuejaConDetalles = async (req, res) => {
    const { id } = req.params;

    try {
        const queja = await quejaDAO.findOneByCiudadanoId(id);
        if (queja) {
            return res.status(200).json(queja);
        } else {
            return res.status(404).json({ success: false, message: "Queja no encontrada" });
        }
    } catch (error) {
        console.error('Error al obtener la queja:', error);
        return res.status(500).json({ error: 'Error al obtener la queja' });
    }
};

const updateEstado = async (req, res) => {
    const { id } = req.params;
    const { estado_id } = req.body;
    try {
        const queja = await quejaDAO.updateEstado(id, estado_id);
        return res.status(200).json({ message: 'Estado actualizado con éxito', queja });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el estado', error });
    }
};

const getQuejasUsuario = async (req, res) => {
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const { id } = decoded;
        const ciudadano = await ciudadanoDAO.findOneByUserID(id);
        const quejas = await quejaDAO.findAllbyCiudadanoID(ciudadano.id);
        return res.status(200).json(quejas);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const quejaController = { agregarQueja, encontrarDistrito, encontrarUbicacion , obtenerQuejasFiltradas, obtenerQuejaConDetalles, getQuejasUsuario, updateEstado}


export default quejaController;
