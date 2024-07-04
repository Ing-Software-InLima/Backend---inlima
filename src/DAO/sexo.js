// DAO/sexo.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/sexo.js';

const sexoRepository = new RepositoryBase(modelo);

const findAll = async (req,res) => {

    const sexos = await Repository.findAll();

    return res.status(200).json(sexos);

}

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

export { sexoDAO as default };