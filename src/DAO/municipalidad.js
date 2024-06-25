// DAO/municipalidad.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/municipalidad.js';

const municipalidadRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await municipalidadRepository.findAll();
};

const findAllByAdminID = async (administrador_id) => {
    try {
        return await modelo.findAll({
            where: { administrador_id }
        })
    }
    catch(err) {
        console.error(err);
        return null;
    }  
};

const create = async (data) => {
    return await municipalidadRepository.create(data);
};

const findOne = async (id) => {
    return await municipalidadRepository.findOne(id);
};

const update = async (data) => {
    return await municipalidadRepository.update(data);
};

const remove = async (id) => {
    return await municipalidadRepository.remove(id);
};

const municipalidadDAO = { findAll, findAllByAdminID, create, findOne, update, remove };

export default municipalidadDAO;