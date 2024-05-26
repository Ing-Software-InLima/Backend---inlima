import RepositoryBase from "../repository/base.js";
import modelo from '../model/administador.js';

const administradorRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await administradorRepository.findAll();
};

const create = async (data) => {
    return await administradorRepository.create(data);
};

const findOne = async (id) => {
    return await administradorRepository.findOne(id);
};

const update = async (data) => {
    return await administradorRepository.update(data);
};

const remove = async (id) => {
    return await administradorRepository.remove(id);
};

const administradorDAO = { findAll, create, findOne, update, remove };

export default administradorDAO;