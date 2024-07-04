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


const updatePerfil = async (id, contraseña, imagen) => {
    try {
        const user = await findOne(id);
        if (!user) {
            throw new Error('User no encontrada.');
        }
        user.id = id;
        user.password = contraseña;
        user.foto = imagen;
        await user.save();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const resetPassword = async (id, contraseña) => {
    try {
        const user = await findOne(id);
        if (!user) {
            throw new Error('User no encontrada.');
        }
        user.id = id;
        user.password = contraseña;
        await user.save();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const usuarioDAO = { findAll, create, findOne, update, remove, findOneByEmail, updatePerfil, resetPassword };

export { usuarioDAO as default };