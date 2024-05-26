import usuarioDAO from '../DAO/usuario.js';

const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!password) {
          return res.status(400).json({ success: false, message: 'Debe proporcionar email y contraseña' });
      }

        const usuario = await usuarioDAO.findOneByEmail(email);// Agrega await aquí

        if (usuario && usuario.password === password) {
            // Aquí podrías agregar lógica para generar un token de sesión o JWT
            return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario: usuario });
        } else {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const usuarioController = { iniciarSesion };

export default usuarioController;
