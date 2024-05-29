// src/routes/historial.js
import express from 'express'

import controller from '../controllers/historial.js'
import controller2 from '../controller/historial.js'

const routes = express.Router()

routes.post('/register',controller2.registrarCambio)
routes.get('/', controller.findAll ) 
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)

export default routes