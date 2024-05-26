import usuarioDAO from '../DAO/usuario.js';
import administradorDAO from '../DAO/administrador.js';
import historialDAO from '../DAO/historial.js';

const registrarCambio = async (req, res) => {
    try {
        const { queja_id, email, estado_id } = req.body;        
        const usuario = await usuarioDAO.findOneByEmail(email);
        const administrador = await administradorDAO.findOneByUserID(usuario.id);

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
