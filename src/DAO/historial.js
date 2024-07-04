import RepositoryBase from "../repository/base.js";
import modelo from '../model/historial.js';

const historialRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await historialRepository.findAll();
};

const create = async (data) => {
    return await historialRepository.create(data);
};

const findOne = async (id) => {
    return await historialRepository.findOne(id);
};

const update = async (data) => {
    return await historialRepository.update(data);
};

const remove = async (id) => {
    return await historialRepository.remove(id);
};

const historialDAO = { findAll, create, findOne, update, remove };

export { historialDAO as default };