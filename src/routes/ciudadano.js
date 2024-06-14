import express from 'express'

import controller from '../controllers/ciudadano.js'
import controller2 from '../controller/ciudadano.js'

const routes = express.Router()

routes.post('/signin',controller2.registrar)
routes.post('/signinGoogle',controller2.registrarGoogle)
routes.get('/', controller.findAll )
routes.post('/calcularReputacion',controller2.calcularReputacion)
routes.post('/encontrarCiudadano',controller2.encontrarCiudadano)
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)

export default routes