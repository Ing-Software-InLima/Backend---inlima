// DAO/usuario.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/queja.js';
import Ciudadano from '../model/ciudadano.js'
import Municipalidad from '../model/municipalidad.js'
import Estado from '../model/estado.js'


const quejaRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await quejaRepository.findAll();
};

const findAllbyCiudadanoID = async (ciudadano_id) => {
    try {
        return await modelo.findAll({
            where: { ciudadano_id }
        })
    }
    catch(err) {
        console.error(err);
        return null;
    }
};

const create = async (data) => {
    return await quejaRepository.create(data);
};

const findOne = async (id) => {
    return await quejaRepository.findOne(id);
};

const update = async (data) => {
    return await quejaRepository.update(data);
};

const remove = async (id) => {
    return await quejaRepository.remove(id);
};

const findFiltered = async (asuntos, municipalidad) => {
    try {
        const whereConditions = {
            ...(asuntos.length > 0 && { asunto: asuntos }),
            ...(municipalidad && { '$Municipalidad.nombre$': municipalidad }),
        };
        console.log('whereConditions:', whereConditions);
    
        return await modelo.findAll({
            where: whereConditions,
            include: [
                { model: Estado, attributes: ['nombre'] },
                { model: Ciudadano, attributes: ['dni'] },
                { model: Municipalidad, attributes: ['nombre'] },
            ],
        });
    } catch (error) {
        console.error('Error en findFiltered:', error);
        return null;
    }
};

const findOneByCiudadanoId = async (id) => {
    try {
        return await modelo.findOne({
            where: { id },
            include: [
                { model: Estado, attributes: ['nombre'] },
                { model: Ciudadano, attributes: ['dni'] },
                { model: Municipalidad, attributes: ['nombre'] },
            ]
        });
    } catch (err) {
        console.error(err);
        return null;
    }
};

const quejaDAO = { findAll, findAllbyCiudadanoID, create, findOne, update, remove , findFiltered, findOneByCiudadanoId};

export default quejaDAO;