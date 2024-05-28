import quejaDAO from '../DAO/queja.js';
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import municipalidadDAO from '../DAO/municipalidad.js';
import jwt from 'jsonwebtoken'
const agregarQueja = async (req, res) => {
    //console.log("cesar sapo")
    //console.log("cookie", req.cookies)
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        //console.log("decoded", decoded)
        const { id } = decoded;

        const { asunto, descripcion, foto, ubicacion_descripcion, latitud, longitud, municipalidad } = req.body;

        const ciudadano = await ciudadanoDAO.findOne(id);
        if (!ciudadano) {
            return res.status(404).json({ success: false, message: "Ciudadano no encontrado" });
        }

        //console.log("Usuario ID:", id);
        //console.log("Ciudadano ID:", ciudadano.id);

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
        console.log("QUEJA CREADA")
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

const obtenerQuejasFiltradas = async (req, res) => {
    console.log("Ingreso a obtener quejas filtred")
    try {
        const {asuntos, municipalidad} = req.body;
        const resultados = await quejaDAO.findFiltered(asuntos, municipalidad);
        console.log("Resultados de la búsqueda:", resultados); // Imprimir en consola para verificar los resultados
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

const quejaController = { agregarQueja, actualizarQueja, encontrarDistrito, encontrarUbicacion , obtenerQuejasFiltradas, obtenerQuejaConDetalles, updateEstado}

export default quejaController;
