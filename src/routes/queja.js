import express from 'express'

import controller from '../controllers/queja.js'
import controller2 from '../controller/queja.js'

const routes = express.Router()

routes.post('/create', controller2.agregarQueja)
routes.get('/', controller.findAll ) 
routes.post('/', controller.create )
routes.get('/:id', controller.findOne )
routes.put('/', controller.update )
routes.delete('/:id', controller.remove)

export default routes