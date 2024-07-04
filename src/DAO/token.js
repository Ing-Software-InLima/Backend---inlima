// DAO/municipalidad.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/token.js';

const tokenRepository = new RepositoryBase(modelo);

const findAll = async (req,res) => {

    const municipalidades = await tokenRepository.findAll();

    return res.status(200).json(municipalidades);
}

const create = async (data) => {
    return await tokenRepository.create(data);
};

const findOne = async (id) => {
    return await tokenRepository.findOne(id);
};

const findOneByEmail = async (email) => {
    try {
        return await modelo.findOne({
            where: { email },
        })
    }
    catch(err) {
        console.error(err);
        return null;
    }
};

const update = async (data) => {
    return await tokenRepository.update(data);
};

const remove = async (id) => {
    return await tokenRepository.remove(id);
};

const tokenDAO = { findAll, create, findOne, findOneByEmail, update, remove };

export { tokenDAO as default };