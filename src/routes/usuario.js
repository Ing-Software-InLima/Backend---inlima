import express from 'express'

import controller from '../controllers/usuario.js'
import controller2 from '../controller/usuario.js'

const routes = express.Router()

routes.get('/', controller.findAll) 
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)
routes.post('/login', controller2.iniciarSesion)
//routes.get('/logout', controller2.cerrarSesion)
routes.post('/update', controller2.actualizarCuenta)

export default routes