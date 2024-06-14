import express from 'express'

import controller from '../controllers/usuario.js'
import controller2 from '../controller/usuario.js'

const routes = express.Router()

routes.get('/', controller.findAll) 
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)
routes.post('/encontrarCiudadano', controller2.encontrarUsuario)
routes.get('/getrol',controller2.obtenerRol)
routes.get('/findUserToken',controller2.findUserToken)
routes.post('/login', controller2.iniciarSesion)
routes.post('/loginGoogle', controller2.iniciarSesionGoogle)
routes.post('/findUserbyEmail', controller2.findUserbyEmail)
routes.post('/actualizarCuenta', controller2.actualizarCuenta)
routes.get('/logout', controller2.cerrarSesion)
routes.post('/resetps', controller2.resetPassword)

export default routes