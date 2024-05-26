import quejaDAO from '../DAO/queja.js';
import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';

const agregarQueja = async (req, res) => {
    const { asunto, descripcion, foto, ubicacion_descripcion, latitud, longitud, municipalidad, email } = req.body;
    try {
        const usuario = await usuarioDAO.findOneByEmail(email);
        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const ciudadano = await ciudadanoDAO.findOne(usuario.id);
        if (!ciudadano) {
            return res.status(404).json({ success: false, message: "Ciudadano no encontrado" });
        }

        console.log("Usuario ID:", usuario.id);
        console.log("Ciudadano ID:", ciudadano.id);

        const queja = await quejaDAO.create({
            asunto: asunto,
            descripcion: descripcion,
            foto: foto,
            ubicacion_descripcion: ubicacion_descripcion,
            latitud: latitud,
            longitud: longitud,
            estado_id: 1,
            ciudadano_id: ciudadano.id,
            municipalidad_id: municipalidad
        });

        return res.status(200).json({ success: true, message: "Queja enviada", data: queja });
    } catch (error) {
        console.error("Error al agregar queja:", error); // Agregar logs detallados
        return res.status(500).json({ success: false, message: error.message });
    }
};

const quejaController = { agregarQueja };

export default quejaController;
