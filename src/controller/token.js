import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import crypto from 'crypto';
import tokenDAO from '../DAO/token.js';
import usuarioDAO from '../DAO/usuario.js';

dotenv.config();

const enviarToken = async (req, res) => {
    try {
        const { 
            CLIENT_ID, 
            CLIENT_SECRET, 
            REDIRECT_URI, 
            REFRESH_TOKEN, 
            USER_EMAIL 
        } = process.env;

        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        let accessTokenResponse;
        try {
            accessTokenResponse = await oAuth2Client.getAccessToken();
        } catch (err) {
            console.error('Error obtaining access token:', err);
            return res.status(500).json({ message: 'Failed to obtain access token', error: err.message });
        }

        if (!accessTokenResponse.token) {
            return res.status(500).json({ message: 'Failed to retrieve access token' });
        }

        const accessToken = accessTokenResponse.token;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
        
        const { email } = req.body;
        console.log('hola');
        console.log(email);

        const ciudadano = await usuarioDAO.findOneByEmail(email);
        if (ciudadano) {
            return res.status(204).json({ message: 'El usuario ya ha sido registrado. Intenté con otro correo.' });
        }
        
        const aux = await tokenDAO.findOneByEmail(email);

        //console.log(aux);
        if(aux){
            await tokenDAO.remove(aux.id);
        }

        const token = crypto.randomInt(100000,999999).toString();
        
        const mailOptions = {
            from: 'inLimaApp@gmail.com',
            to: email,
            subject: `INLIMA: TOKEN DE VERIFICACIÓN DE CUENTA`,
            html: `
            <div style="
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 30px auto; 
                border: 1px solid #e0e0e0; 
                padding: 30px; 
                border-radius: 15px; 
                background-color: #ffffff; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            ">
            <div style="
                text-align: center; 
                padding: 20px 0;
            ">
                <img 
                    src="https://i.imgur.com/h6xBALR.png" 
                    alt="INLIMA Logo" 
                    style="
                        width: 150px; 
                        margin-bottom: 20px;
                    "
                >
            </div>
            <p style="
                font-size: 18px; 
                color: #444; 
                margin: 20px 0;
            ">
                Hola <strong style="color: #C52233;"></strong>,
            </p>
            <p style="
                font-size: 16px; 
                color: #555; 
                margin: 20px 0;
            ">
                Queremos informarte que el token de verificación de correo es  
                <strong style="color: #28a745;">${token}</strong>.
            </p>
            <p style="
                font-size: 16px; 
                color: #555; 
                margin: 20px 0;
            ">
                Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros. No compartes este token con otros usuarios.
            </p>
            <p style="
                font-size: 16px; 
                color: #555; 
                margin: 20px 0;
            ">
                Atentamente,<br>
                <strong>El equipo de InLima</strong>
            </p>
            <footer style="
                margin-top: 30px; 
                font-size: 14px; 
                color: #777; 
                text-align: center; 
                border-top: 1px solid #e0e0e0; 
                padding-top: 20px;
            ">
                © 2024 INLIMA. Todos los derechos reservados.
            </footer>
        </div>

        `
        };

        const envio = await transporter.sendMail(mailOptions);
        //console.log('prueba')

        if (envio){
            const tokenEnviado = await tokenDAO.create({
                email: email,
                token: token
            })

            //console.log('prueba')
            
            if (tokenEnviado){
                res.status(200).json({ message: 'Email sent successfully' });
            }
        }
        
    } catch (error) {
        console.error('entraaaaaaa');
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

const enviarTokenReseteo = async (req, res) => {
    try {
        const { 
            CLIENT_ID, 
            CLIENT_SECRET, 
            REDIRECT_URI, 
            REFRESH_TOKEN, 
            USER_EMAIL 
        } = process.env;

        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        let accessTokenResponse;
        try {
            accessTokenResponse = await oAuth2Client.getAccessToken();
        } catch (err) {
            console.error('Error obtaining access token:', err);
            return res.status(500).json({ message: 'Failed to obtain access token', error: err.message });
        }

        if (!accessTokenResponse.token) {
            return res.status(500).json({ message: 'Failed to retrieve access token' });
        }

        const accessToken = accessTokenResponse.token;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
        
        const { email } = req.body;
        console.log('hola');
        console.log(email);
        
        const aux = await tokenDAO.findOneByEmail(email);

        //console.log(aux);
        if(aux){
            await tokenDAO.remove(aux.id);
        }

        const token = crypto.randomInt(100000,999999).toString();
        
        const mailOptions = {
            from: 'inLimaApp@gmail.com',
            to: email,
            subject: `INLIMA: TOKEN DE VERIFICACIÓN DE CUENTA`,
            html: `
            <div style="
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 30px auto; 
                border: 1px solid #e0e0e0; 
                padding: 30px; 
                border-radius: 15px; 
                background-color: #ffffff; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            ">
            <div style="
                text-align: center; 
                padding: 20px 0;
            ">
                <img 
                    src="https://i.imgur.com/h6xBALR.png" 
                    alt="INLIMA Logo" 
                    style="
                        width: 150px; 
                        margin-bottom: 20px;
                    "
                >
            </div>
            <p style="
                font-size: 18px; 
                color: #444; 
                margin: 20px 0;
            ">
                Hola <strong style="color: #C52233;"></strong>,
            </p>
            <p style="
                font-size: 16px; 
                color: #555; 
                margin: 20px 0;
            ">
                Queremos informarte que el token de verificación de correo es  
                <strong style="color: #28a745;">${token}</strong>.
            </p>
            <p style="
                font-size: 16px; 
                color: #555; 
                margin: 20px 0;
            ">
                Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros. No compartes este token con otros usuarios.
            </p>
            <p style="
                font-size: 16px; 
                color: #555; 
                margin: 20px 0;
            ">
                Atentamente,<br>
                <strong>El equipo de InLima</strong>
            </p>
            <footer style="
                margin-top: 30px; 
                font-size: 14px; 
                color: #777; 
                text-align: center; 
                border-top: 1px solid #e0e0e0; 
                padding-top: 20px;
            ">
                © 2024 INLIMA. Todos los derechos reservados.
            </footer>
        </div>

        `
        };

        const envio = await transporter.sendMail(mailOptions);
        //console.log('prueba')

        if (envio){
            const tokenEnviado = await tokenDAO.create({
                email: email,
                token: token
            })

            //console.log('prueba')
            
            if (tokenEnviado){
                res.status(200).json({ message: 'Email sent successfully' });
            }
        }
        
    } catch (error) {
        console.error('entraaaaaaa');
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

const verificarToken = async (req, res) => {
    try {
        const { email, token } = req.body;
        const aux = await tokenDAO.findOneByEmail(email);

        if(aux){
            const now = new Date();
            const tokenCreatedAt = new Date(aux.createdAt);

            console.log('now:', now);
            console.log('tokenCreatedAt:', tokenCreatedAt);

            // Asegúrate de que ambas fechas están en UTC
            const nowUTC = new Date(now.toISOString());
            const tokenCreatedAtUTC = new Date(tokenCreatedAt.toISOString());

            console.log('nowUTC:', nowUTC);
            console.log('tokenCreatedAtUTC:', tokenCreatedAtUTC);

            const tokenAgeMilliseconds = nowUTC.getTime() - tokenCreatedAtUTC.getTime();
            const tokenAgeMinutes = tokenAgeMilliseconds / 60000;

            console.log('tokenAgeMinutes:', tokenAgeMinutes);

            console.log(tokenAgeMinutes)

            if (tokenAgeMinutes <= 10) {
                if (aux.token === token) {
                    await tokenDAO.remove(aux.id);
                    return res.status(200).json({ message: 'Correo verificado' });
                } else {
                    return res.status(300).json({ message: 'Token incorrecto' });
                }
            } else {
                await tokenDAO.remove(aux.id);
                return res.status(400).json({ message: 'El token ha expirado' });
            }
            
        }else{
            res.status(400).json({ message: 'El token ha expirado' });
        }

    } catch (error) {
        console.error(entraaaaaaaa)
        res.status(500).json({ message: 'Fail', error: error.message });
    }
};

const tokenController = { enviarToken, enviarTokenReseteo , verificarToken };

export default tokenController;
