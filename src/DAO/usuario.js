// DAO/usuario.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/usuario.js';

const usuarioRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await usuarioRepository.findAll();
};

const create = async (data) => {
    return await usuarioRepository.create(data);
};

const findOne = async (id) => {
    return await usuarioRepository.findOne(id);
};

const findOneByEmail = async (email) => {
    return await modelo.findOne({
        where: { email }
    })
};

const update = async (data) => {
    return await usuarioRepository.update(data);
};

const remove = async (id) => {
    return await usuarioRepository.remove(id);
};

const usuarioDAO = { findAll, create, findOne, update, remove, findOneByEmail };

export default usuarioDAO;