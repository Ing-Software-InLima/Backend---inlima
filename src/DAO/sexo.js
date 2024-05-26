// DAO/usuario.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/sexo.js';

const sexoRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await sexoRepository.findAll();
};

const create = async (data) => {
    return await sexoRepository.create(data);
};

const findOne = async (id) => {
    return await sexoRepository.findOne(id);
};

const update = async (data) => {
    return await sexoRepository.update(data);
};

const remove = async (id) => {
    return await sexoRepository.remove(id);
};

const sexoDAO = { findAll, create, findOne, update, remove };

export default sexoDAO;