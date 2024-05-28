import { Resend } from 'resend';

const resend = new Resend('re_G3gjJPcj_Cxw87BFq6umvtGjukjeQM7Rt');

const enviarCorreo = async (req, res) => {
    try {
        const { email, estado } = req.body;

        await resend.emails.send({
            from: 'inLimaApp@gmail.com',
            to: email,
            subject: 'INLIMA: HOLAAAAAAA',
            html: <p>Cambio el estado de tu queja a ${estado}</p>
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

const notificadorController = { enviarCorreo };

export default notificadorController;