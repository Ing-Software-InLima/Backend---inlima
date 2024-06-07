import nodemailer from 'nodemailer';
import { google } from 'googleapis';


const enviarCorreo = async (req, res) => {
    try {
        const credentials = {
            installed: {
                client_id: "341460726817-ubqk5qmhupp2a9bg9f40cdf29ffrr3vc.apps.googleusercontent.com",
                project_id: "studious-karma-424718-n2",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_secret: "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",

                redirect_uris: [
                    "urn:ietf:wg:oauth:2.0:oob",
                    "http://localhost"
                ],
                refresh_token: "1//04r9KC04Akr6aCgYIARAAGAQSNwF-L9IrcxvwoModx9lj_-bbfQaxUXqtd9oytvsQc1uDBSAnZss1Sh-YshvgXpY10XTjsmBgvXg"
            }
        };
        const oAuth2Client = new google.auth.OAuth2(
            credentials.installed.client_id,
            credentials.installed.client_secret,
            credentials.installed.redirect_uris[0]
        );

        // Establecer credenciales
        oAuth2Client.setCredentials({
            refresh_token: credentials.installed.refresh_token
        });

        // Configurar el transportador de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'inLimaApp@gmail.com',
                clientId: credentials.installed.client_id,
                clientSecret: credentials.installed.client_secret,
                refreshToken: credentials.installed.refresh_token,
                accessToken: oAuth2Client.getAccessToken(),
            }
        });
        const { email, estado, queja, nombre, asunto, fecha } = req.body;

        // Configurar el correo
        const mailOptions = {
            from: 'inLimaApp@gmail.com',
            to: email,
            subject: `INLIMA: NOTIFICACIÓN CAMBIO DE ESTADO DE QUEJA - TICKET IL00${queja}`,
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
