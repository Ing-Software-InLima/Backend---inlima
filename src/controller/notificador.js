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
                refresh_token: "1//04Tga2nXJgfRwCgYIARAAGAQSNwF-L9IrlGgd7nWo63bPx6-DsfTw8DGdzQ4vZ2DulnnaKXprxKEtjPOisyHsoWv5xb8oEW1VbNY"
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
        const { email, estado, queja, nombre } = req.body;

        // Configurar el correo
        const mailOptions = {
            from: 'inLimaApp@gmail.com',
            to: email,
            subject: `INLIMA: NOTIFICACIÓN CAMBIO DE ESTADO DE QUEJA - TICKET ${queja}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                <h2 style="color: #007bff; text-align: center;">INLIMA</h2>
                <p style="font-size: 16px; color: #333;">
                    Hola ${nombre},
                </p>
                <p style="font-size: 16px; color: #333;">
                    Queremos informarte que el estado de tu queja ha cambiado a <strong>${estado}</strong>.
                </p>
                <p style="font-size: 16px; color: #333;">
                    Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.
                </p>
                <p style="font-size: 16px; color: #333;">
                    Atentamente,<br>
                    El equipo de INLIMA
                </p>
                <footer style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
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
