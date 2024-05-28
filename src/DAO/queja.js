// DAO/usuario.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/queja.js';
import Ciudadano from '../model/ciudadano.js'
import Municipalidad from '../model/municipalidad.js'
import Estado from '../model/estado.js'
import Op from 'sequelize'

const quejaRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await quejaRepository.findAll();
};

const findAllbyCiudadanoID = async (ciudadano_id) => {
    try {
        return await modelo.findAll({
            where: { ciudadano_id },
            include: [
                { model: Estado},
                { model: Ciudadano, attributes: ['dni'] },
                { model: Municipalidad},
            ]
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
        console.log("FUNCION EN DAO", asuntos, municipalidad)
        const whereConditions = {
            ...(asuntos.length > 0 && { 'asunto': asuntos }),
            ...(municipalidad && { 'municipalidad_id': municipalidad }),
        };
        console.log('whereConditions:', whereConditions);
    
        const respuesta = await quejaRepository.findAll({
            where: whereConditions,
            include: [
                { model: Estado},
                { model: Ciudadano},
                { model: Municipalidad},
            ]

        });
        console.log("respuesta", respuesta)
        if(respuesta){
            const datavaluesArray = respuesta.map(queja => queja.dataValues);
            return datavaluesArray
        }else{
            return []
        }
        
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