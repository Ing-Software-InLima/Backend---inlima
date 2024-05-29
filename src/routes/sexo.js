import express from 'express'

//import controller from '../controllers/sexo.js'
import DAO from '../DAO/sexo.js'

const routes = express.Router()

routes.get('/', DAO.findAll ) 
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)

export default routes