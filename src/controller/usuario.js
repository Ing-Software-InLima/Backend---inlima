import usuarioDAO from '../DAO/usuario.js';

const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;
  
    try {

      const usuarioEncontrado = usuarioDAO.findOneByEmail(email)
  
      if (usuarioEncontrado && usuarioEncontrado.password === password) {
        // Aquí podrías agregar lógica para generar un token de sesión o JWT
        return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario: usuarioEncontrado });
      } else {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas', usuario: usuarioEncontrado });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  const usuarioController = { iniciarSesion };
  
  export default usuarioController;
