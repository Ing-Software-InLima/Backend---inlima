// src/controller/historial.js
import usuarioDAO from '../DAO/usuario.js';
import administradorDAO from '../DAO/administrador.js';
import historialDAO from '../DAO/historial.js';
import jwt from 'jsonwebtoken';

const registrarCambio = async (req, res) => {
    const myToken = req.cookies?.myToken;
    try {
        if (!myToken) {
            return res.status(401).json({ success: false, message: 'No se encontró el token' });
        }
        const decoded = jwt.verify(myToken, 'secret');
        const { id } = decoded;
        const { queja_id, estado_id } = req.body;        
        const administrador = await administradorDAO.findOneByUserID(id);
        await historialDAO.create({
            fecha: new Date(),
            administrador_id: administrador.id,
            queja_id: queja_id,
            estado_id: estado_id
        });
        return res.status(200).json({ success: true, message: 'Cambio registrado' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const historialController = { registrarCambio };

export default historialController;
