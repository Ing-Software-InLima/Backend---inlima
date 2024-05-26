import express from 'express'

import controller from '../controllers/usuario.js'
import controller2 from '../controller/usuario.js'

const routes = express.Router()

routes.post('/login',controller2.iniciarSesion)
routes.get('/', controller.findAll ) 
routes.post('/', controller.create )
routes.get('/:id', controller.findOne )
routes.put('/', controller.update )
routes.delete('/:id', controller.remove)

export default routes