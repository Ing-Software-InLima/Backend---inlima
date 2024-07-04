// DAO/rol.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/rol.js';

const rolRepository = new RepositoryBase(modelo);

const findAll = async (req,res) => {

    const rols = await rolRepository.findAll();

    return res.status(200).json(rols);

}

const create = async (data) => {
    return await rolRepository.create(data);
};

const findOne = async (id) => {
    return await rolRepository.findOne(id);
};

const update = async (data) => {
    return await rolRepository.update(data);
};

const remove = async (id) => {
    return await rolRepository.remove(id);
};

const rolDAO = { findAll, create, findOne, update, remove };

export { rolDAO as default };