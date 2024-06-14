// DAO/municipalidad.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/municipalidad.js';

const municipalidadRepository = new RepositoryBase(modelo);

const findAll = async (req,res) => {

    const municipalidades = await municipalidadRepository.findAll();

    return res.status(200).json(municipalidades);
}

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

const municipalidadDAO = { findAll, create, findOne, update, remove };

export default municipalidadDAO;