import RepositoryBase from "../repository/base.js";
import modelo from '../model/administrador.js';

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

const findOneByUserID = async (usuario_id) => {
    try {
        return await modelo.findOne({
            where: { usuario_id }
        })
    }
    catch(err) {
        console.error(err);
        return null;
    }
}

const update = async (data) => {
    return await administradorRepository.update(data);
};

const remove = async (id) => {
    return await administradorRepository.remove(id);
};

const administradorDAO = { findAll, create, findOne, findOneByUserID, update, remove };

export { administradorDAO as default };