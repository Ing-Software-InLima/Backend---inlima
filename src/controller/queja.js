import quejaDAO from '../DAO/queja.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import municipalidadDAO from '../DAO/municipalidad.js';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';
import administradorDAO from '../DAO/administrador.js';
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
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        //console.error("Error al agregar queja:", error); // Agregar logs detallados
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
    }catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};

const obtenerQuejasFiltradas = async (req, res) => {
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const { id } = decoded;
        const admin = await administradorDAO.findOneByUserID(id);

        const ASUNTOS_PREDEFINIDOS = [
            "Veredas rotas", "Calles contaminadas", "Poste de luces apagadas",
            "Construcción sin licencia", "Comercio ilegal", "Invasión no autorizada de lugares públicos",
            "Árboles obstruyen la circulación", "Vehículo abandonado", "Mascota perdida",
            "Inmueble abandonado", "Propiedad en mal estado"
        ];
        
        const {asuntos} = req.body;
        let whereConditions = {};
        // Condiciones para asuntos
        if (asuntos.length > 0) {
            const contieneOtros = asuntos.includes('Otros');
            const otrosAsuntos = asuntos.filter(asunto => asunto !== 'Otros');

            // Condición para "Otros"
            if (contieneOtros) {
                if (otrosAsuntos.length > 0) {
                    whereConditions = {
                        ...whereConditions,
                        [Symbol.for('or')]: [
                            { asunto: { [Symbol.for('notIn')]: ASUNTOS_PREDEFINIDOS } },
                            { asunto: { [Symbol.for('in')]: otrosAsuntos } }
                        ]
                    };
                } else {
                    whereConditions = {
                        ...whereConditions,
                        asunto: { [Symbol.for('notIn')]: ASUNTOS_PREDEFINIDOS }
                    };
                }
            } else if (otrosAsuntos.length > 0) {
                whereConditions = {
                    ...whereConditions,
                    asunto: { [Symbol.for('in')]: otrosAsuntos }
                };
            }
        }

        const municipalidad = admin.municipalidad_id;
        // Condición para municipalidad
        if (municipalidad) {
            whereConditions = {
                ...whereConditions,
                municipalidad_id: municipalidad
            };
        }else{
            const municipalidades = await municipalidadDAO.findAll();
            const municipalidadIds = municipalidades.map(muni => muni.id);

            whereConditions = {
                ...whereConditions,
                municipalidad_id: {
                    [Sequelize.Op.in]: municipalidadIds
                }
            };
        }

        const resultados = await quejaDAO.findFiltered(whereConditions);

        res.status(200).json(resultados);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
/*
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
};*/

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
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


const puntuacionQueja = async (req, res) => {

    const {id} = req.params;
    const {calificacion} = req.body;

    try {
        const queja = await quejaDAO.findOne(id);

        if (!queja) {
            return res.status(404).json({ message: 'Queja no encontrada' });
        }
        queja.dataValues.calificacion = calificacion;
        const updatedQueja = await quejaDAO.update(queja);

        if (!updatedQueja) {
            return res.status(404).json({ message: 'No se pudo actualizar la queja' });
        }

        return res.status(200).json({ message: 'Puntuación actualizada con éxito', queja: updatedQueja });
    } catch (error) {
        console.error('Error al actualizar la puntuación de la queja:', error);
        return res.status(500).json({ message: 'Error al actualizar la puntuación de la queja', error: error.message });
    }
};

const prioridadQueja = async (req, res) => {
    const myToken = req.cookies?.myToken;
    const { id } = req.params;
    const { prioridad } = req.body;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const { rol } = decoded;
        if(rol != 2){//no es admin
            return res.status(401).json({ success: false, message: 'Usuario no es administrador' });
        }else{
            const queja = await quejaDAO.updatePrioridad(id, prioridad);
            return res.status(200).json({ message: 'Prioridad actualizada con éxito', queja });
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Error al actualizar prioridad', error });
    }
}


const quejaController = { agregarQueja, encontrarDistrito, encontrarUbicacion , obtenerQuejasFiltradas, obtenerQuejaConDetalles, getQuejasUsuario, updateEstado,puntuacionQueja, prioridadQueja}


export default quejaController;
