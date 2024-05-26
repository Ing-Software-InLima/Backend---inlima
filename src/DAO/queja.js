// DAO/usuario.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/queja.js';

const quejaRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await quejaRepository.findAll();
};

const findAllbyCiudadanoID = async (ciudadano_id) => {
    try {
        return await modelo.findAll({
            where: { ciudadano_id }
        })
    }
    catch(err) {
        console.error(err);
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

const quejaDAO = { findAll, findAllbyCiudadanoID, create, findOne, update, remove };

export default quejaDAO;