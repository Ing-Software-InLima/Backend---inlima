// src/controller/historial.js
import usuarioDAO from '../DAO/usuario.js';
import administradorDAO from '../DAO/administrador.js';
import historialDAO from '../DAO/historial.js';
import municipalidadDAO from '../DAO/municipalidad.js';
import jwt from 'jsonwebtoken';

const findMunicipalidades = async (req, res) => {
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const { id, rol } = decoded;
        if (rol === 2){
            const admin = await administradorDAO.findOneByUserID(id);
            const municipalidades = await municipalidadDAO.findAllByAdminID(admin.id);
            return res.status(200).json(municipalidades);
        }else{
            const municipalidades = await municipalidadDAO.findAll();
            return res.status(200).json(municipalidades);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const historialController = { findMunicipalidades };

export default historialController;
