import express from 'express'

import controller from '../controllers/administrador.js'
import controller_ from '../controller/administrador.js'
const routes = express.Router()

routes.get('/', controller.findAll ) 
routes.post('/', controller.create )
routes.get('/:id', controller.findOne )
routes.put('/', controller.update )
routes.delete('/:id', controller.remove)
routes.post('/findMun', controller_.findMunicipalidadByAdminId)
export default routes