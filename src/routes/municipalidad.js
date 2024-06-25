import express from 'express'

//import controller from '../controllers/municipalidad.js'
import controller from '../controller/municipalidad.js'

const routes = express.Router()

routes.get('/', controller.findMunicipalidades ) 
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)

export default routes