import usuarioDAO from '../DAO/usuario.js';
import administradorDAO from '../DAO/administrador.js';
import municipalidadDAO from '../DAO/municipalidad.js';
import jwt from 'jsonwebtoken';

const findMunicipalidadByAdminId = async (req, res) => {
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const {id} = decoded;     
        const administrador = await administradorDAO.findOneByUserID(id);
        const mun = await municipalidadDAO.findOne(administrador.dataValues.municipalidad_id)
        return res.status(200).json({ success: true, message: 'Municipalidad encontrada', mun });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const administradorController = { findMunicipalidadByAdminId };

export default administradorController;