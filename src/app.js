// src/app.js
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

import ciudadanoRoutes from './routes/ciudadano.js'
import estadoRoutes from './routes/estado.js'
import municipalidadRoutes from './routes/municipalidad.js'
import quejaRoutes from './routes/queja.js'
import rolRoutes from './routes/rol.js'
import sexoRoutes from './routes/sexo.js'
import usuarioRoutes from './routes/usuario.js'
import administradorRoutes from './routes/administrador.js'
import historialRoutes from './routes/historial.js'
import notificadorRoutes from './routes/notificador.js'
import cookieParser from 'cookie-parser'

var app = express();
//app.use(bodyParser.json())
app.use(bodyParser.json({ limit: '100mb' }));
const corsOptions = {
    origin: 'http://localhost:3000', // Origen del frontend
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware para configurar las cabeceras de caché
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
    next();
});

app.get('/', (req, res) => {
    return res.json({ result: 'OK' })
})

app.use("/ciudadano", ciudadanoRoutes)
app.use("/estado", estadoRoutes)
app.use("/municipalidad", municipalidadRoutes)
app.use("/queja", quejaRoutes)
app.use("/rol", rolRoutes)
app.use("/sexo", sexoRoutes)
app.use("/usuario", usuarioRoutes)
app.use("/administrador", administradorRoutes)
app.use("/historial", historialRoutes)
app.use("/notificador",notificadorRoutes)

export default app;