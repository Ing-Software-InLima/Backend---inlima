import usuarioDAO from '../DAO/usuario.js';
import jwt from 'jsonwebtoken'

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuarioEncontrado = await usuarioDAO.findOneByEmail(email)
    if (usuarioEncontrado && usuarioEncontrado.password === password) {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        rol: usuarioEncontrado.rol_id,
        email: usuarioEncontrado.email, //nose si email o correo
        nombre: usuarioEncontrado.nombre,
        foto: usuarioEncontrado.foto
      }, 'secret')
      res.cookie('myToken', token)
      return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const cerrarSesion = async (req, res) => {
  const myToken = req.cookies?.myToken
  try {
    jwt.verify(myToken, 'secret')
    res.cookie('myToken', null, { maxAge: 0 })
    res.status(200).json("Sesion cerrada correctamente")
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

const usuarioController = { iniciarSesion, cerrarSesion };

export default usuarioController;
