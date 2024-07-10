import express from 'express'
import controller from '../controllers/token.js'
import controller2 from '../controller/token.js'

const routes = express.Router()

//routes.get('/', controller.findAll )

routes.post('/sendtoken', controller2.enviarToken)
routes.post('/sendtokenreset', controller2.enviarTokenReseteo)
routes.post('/verifytoken', controller2.verificarToken)

export default routes