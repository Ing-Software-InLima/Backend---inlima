import usuarioDAO from '../DAO/usuario.js';
import ciudadanoDAO from '../DAO/ciudadano.js';
import jwt from 'jsonwebtoken'

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuarioEncontrado = await usuarioDAO.findOneByEmail(email)
    if (usuarioEncontrado && usuarioEncontrado.password === password) {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        rol: usuarioEncontrado.rol_id,
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        nombre: usuarioEncontrado.nombre
        //foto: usuarioEncontrado.foto
      }, 'secret')
      res.cookie('myToken', token,
        {
          httpOnly: true,
          secure: true, // Solo envía la cookie en solicitudes HTTPS
          sameSite: 'None' // Permite el envío de cookies entre sitios
        }
      )
      return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const iniciarSesionGoogle = async (req, res) => {
  const { email } = req.body;
  try {
    const usuarioEncontrado = await usuarioDAO.findOneByEmail(email)
    if (usuarioEncontrado) {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        rol: usuarioEncontrado.rol_id,
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
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

const actualizarCuenta = async (req, res) => {
  const myToken = req.cookies?.myToken;
  if (!myToken) {
    return res.status(401).json({ success: false, message: 'Token no encontrado' });
  }
  try {
    const decoded = jwt.verify(myToken, 'secret');
    const { id } = decoded;
    const { contraseña, imagen } = req.body;
    await usuarioDAO.updatePerfil(id,contraseña,imagen)

    return res.status(200).json({ success: true, message: 'Datos actualizados con exito' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const obtenerRol = (req, res) => {
  const myToken = req.cookies?.myToken;

  if (!myToken) {
    return res.status(401).json({ success: false, message: 'Token no encontrado' });
  }

  try {
    const decoded = jwt.verify(myToken, 'secret');
    const { rol } = decoded;
    return res.status(200).json({ success: true, rol });
  } catch (error) {
    console.error('Error decoding token:', error);
    return res.status(500).json({ success: false, message: 'Error decodificando el token' });
  }
};

// src/controller/usuario.js
const encontrarUsuario = async (req, res) => {
  const { id_ciudadano } = req.body;
  try {
    const ciudadanoEncontrado = await ciudadanoDAO.findOne(id_ciudadano)
    const usuarioEncontrado = await usuarioDAO.findOne(ciudadanoEncontrado.usuario_id)
    return res.status(200).json({ success: true, usuarioEncontrado });
  } catch (error) {

    return res.status(500).json({ success: false, message: 'No se encontró el usuario' });
  }
};

const findUserToken = async (req, res) => {
  const myToken = req.cookies?.myToken;
  if (!myToken) {
    return res.status(401).json({ success: false, message: 'Token no encontrado' });
  }
  try {
    const decoded = jwt.verify(myToken, 'secret');
    const { id } = decoded;
    //const ciudadanoEncontrado = await ciudadanoDAO.findOne(id)
    //const usuarioEncontrado = await usuarioDAO.findOne(ciudadanoEncontrado.usuario_id)
    const usuarioEncontrado = await usuarioDAO.findOne(id)
    console.log("USUARIO ENCONTRADO", usuarioEncontrado)
    return res.status(200).json({ success: true, usuarioEncontrado });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'No se encontró el usuario' });
  }
};

const findUserbyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await usuarioDAO.findOneByEmail(email);
    if (findUser) {
      return res.status(200).json({ success: true })
    } else {
      return res.status(200).json({ success: false, message: `No se encontró al usuario mediante el email: ${email}` })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al conectar!" })
  }

}

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuarioDAO.findOneByEmail(email);
    await usuarioDAO.resetPassword(usuario.id, password);
    return res.status(200).json({ success: true, message: 'Datos actualizados con exito' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'error.message' });
  }

}
const usuarioController = { iniciarSesion, iniciarSesionGoogle, cerrarSesion, actualizarCuenta, obtenerRol, encontrarUsuario, findUserToken, findUserbyEmail, resetPassword };

export default usuarioController;
