// src/routes/notificador.js
import express from 'express'

import controller from '../controller/notificador.js'

const routes = express.Router()

routes.post('/send', controller.enviarCorreo) 

export default routes