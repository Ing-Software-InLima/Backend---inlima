// DAO/ciudadano.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/ciudadano.js';

const ciudadanoRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await ciudadanoRepository.findAll();
};

const findAllbyID = async (id) => {
    try {
        return await modelo.findAll({
            where: { id }
        })
    }
    catch(err) {
        console.error(err);
        return null;
    }
};

const create = async (data) => {
    return await ciudadanoRepository.create(data);
};

const findOne = async (id) => {
    return await ciudadanoRepository.findOne(id);
};

const findOneByUserID = async (usuario_id) => {
    try {
        return await modelo.findOne({
            where: { usuario_id }
        });
    }
    catch(err) {
        console.error(err);
        return null;
    }
}

const update = async (data) => {
    return await ciudadanoRepository.update(data);
};

const remove = async (id) => {
    return await ciudadanoRepository.remove(id);
};

const ciudadanoDAO = { findAll, findAllbyID, create, findOne, findOneByUserID, update, remove };

export { ciudadanoDAO as default };
