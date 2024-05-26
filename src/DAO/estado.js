// DAO/usuario.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/estado.js';

const estadoRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await estadoRepository.findAll();
};

const create = async (data) => {
    return await estadoRepository.create(data);
};

const findOne = async (id) => {
    return await estadoRepository.findOne(id);
};

const update = async (data) => {
    return await estadoRepository.update(data);
};

const remove = async (id) => {
    return await estadoRepository.remove(id);
};

const estadoDAO = { findAll, create, findOne, update, remove };

export default estadoDAO;