import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

import administradorRoutes from './routes/administrador.js'
import ciudadanoRoutes from './routes/ciudadano.js'
import estadoRoutes from './routes/estado.js'
import historialRoutes from './routes/historial.js'
import municipalidadRoutes from './routes/municipalidad.js'
import quejaRoutes from './routes/queja.js'
import rolRoutes from './routes/rol.js'
import sexoRoutes from './routes/sexo.js'
import usuarioRoutes from './routes/usuario.js'

var app = express();
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    return res.json({ result: 'OK'})
})

app.use("/administrador", administradorRoutes)
app.use("/ciudadano", ciudadanoRoutes)
app.use("/estado", estadoRoutes)
app.use("/historial", historialRoutes)
app.use("/municipalidad", municipalidadRoutes)
app.use("/queja", quejaRoutes)
app.use("/rol", rolRoutes)
app.use("/sexo", sexoRoutes)
app.use("/usuario", usuarioRoutes)

export default app;