import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// instalar npm install dotenv
// https://mail.google.com/

dotenv.config();

const enviarCorreo = async (req, res) => {
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

        // Establecer credenciales
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

        // Configurar el transportador de nodemailer
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
        
        const { email, estado, ticket, nombre, asunto, fecha } = req.body;

        // Configurar el correo
        const mailOptions = {
            from: 'inLimaApp@gmail.com',
            to: email,
            subject: `INLIMA: NOTIFICACIÓN CAMBIO DE ESTADO DE QUEJA - TICKET IL00${ticket}`,
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
        Hola <strong style="color: #C52233;">${nombre}</strong>,
    </p>
    <p style="
        font-size: 16px; 
        color: #555; 
        margin: 20px 0;
    ">
        Queremos informarte que el estado de tu queja ha cambiado a 
        <strong style="color: #28a745;">${estado}</strong>.
    </p>
    <div style="
        font-size: 16px; 
        color: #555; 
        margin: 20px 0; 
        background-color: #f8f9fa; 
        padding: 15px; 
        border-left: 4px solid #C52233;
    ">
        <p><strong>Detalles de su queja:</strong></p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
    </div>
    <p style="
        font-size: 16px; 
        color: #555; 
        margin: 20px 0;
    ">
        Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.
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

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

const notificadorController = { enviarCorreo };

export default notificadorController;
