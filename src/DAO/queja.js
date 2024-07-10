// DAO/queja.js
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
            where: { ciudadano_id },
            include: [
                { model: Estado},
                { model: Ciudadano, attributes: ['dni'] },
                { model: Municipalidad},
            ]
        })
    }
    catch(err) {
        //console.error(err);
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

const findFiltered = async (whereConditions) => {
    try{
        return await modelo.findAll({
            where: whereConditions,
            include: [
                { model: Estado },
                { model: Ciudadano },
                { model: Municipalidad },
            ]
        });
    }catch (err) {
        //console.error(err);
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
        //console.error(err);
        return null;
    }
};

const updateEstado = async (id, estado_id) => {
    try {
        const queja = await findOne(id);
        if (!queja) {
            throw new Error('Queja no encontrada.');
        }
        queja.estado_id = estado_id;
        await queja.save();
        return queja;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updatePrioridad = async (id, prioridad_id) => {
    try {
        const queja = await findOne(id);
        if (!queja) {
            throw new Error('Queja no encontrada.');
        }
        console.log(prioridad_id)
        queja.prioridad = prioridad_id;
        await queja.save();
        return queja;
    } catch (error) {
        throw new Error(error.message);
    }
};

const quejaDAO = { findAll, findAllbyCiudadanoID, create, findOne, update, remove , findFiltered, findOneByCiudadanoId, updateEstado, updatePrioridad};

export { quejaDAO as default };