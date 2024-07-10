import request from 'supertest';
import app from '../app';
import usuarioDAO from '../DAO/usuario';
import jwt from 'jsonwebtoken';

jest.mock('../DAO/usuario');

describe('Usuario Controller - actualizarCuenta', () => {
    let validToken;

    beforeAll(() => {
        validToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                id: 1,
                email: 'test@example.com',
                nombre: 'Test User'
            },
            'secret'
        );
    });

    it('Debe retornar status 401 cuando el token no se encuentra', async () => {
        const response = await request(app)
            .post('/usuario/actualizarCuenta')
            .send({ contraseña: 'newpassword', imagen: 'newimage.jpg' });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Token no encontrado');
    });

    it('Debe retornar status 500 cuando se presenta un error al actualizar', async () => {
        usuarioDAO.updatePerfil.mockImplementation(() => {
            throw new Error('Database not running');
        });

        const response = await request(app)
            .post('/usuario/actualizarCuenta')
            .set('Cookie', `myToken=${validToken}`)
            .send({ contraseña: 'newpassword', imagen: 'newimage.jpg' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Database not running');
    });

    it('Debe retornar status 200 cuando la cuenta se actualiza satisfactoriamente', async () => {
        usuarioDAO.updatePerfil.mockResolvedValue({
            id: 1,
            contraseña: 'newpassword',
            imagen: 'newimage.jpg'
        });

        const response = await request(app)
            .post('/usuario/actualizarCuenta')
            .set('Cookie', `myToken=${validToken}`)
            .send({ contraseña: 'newpassword', imagen: 'newimage.jpg' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Datos actualizados con exito');
    });
});
