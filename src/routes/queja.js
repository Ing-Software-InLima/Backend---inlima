import express from 'express'
import controller from '../controllers/queja.js'
import controller2 from '../controller/queja.js'

const routes = express.Router()

routes.post('/create', controller2.agregarQueja)
//routes.post('/distrito', controller2.encontrarDistrito)
//routes.post('/ubicacion', controller2.encontrarUbicacion)
routes.get('/id/:id', controller2.obtenerQuejaConDetalles)
routes.post('/search', controller2.obtenerQuejasFiltradas)
routes.post('/updateEstado/:id', controller2.updateEstado) 
routes.get('/quejasUsuario', controller2.getQuejasUsuario)
routes.get('/', controller.findAll ) 
routes.post('/puntuacionQueja/:id', controller2.puntuacionQueja)
routes.post('/prioridadQueja/:id', controller2.prioridadQueja)
//routes.post('/', controller.create )
//routes.get('/:id', controller.findOne )
//routes.put('/', controller.update )
//routes.delete('/:id', controller.remove)

export default routes