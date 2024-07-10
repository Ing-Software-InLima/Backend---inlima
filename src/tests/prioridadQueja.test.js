import request from 'supertest';
import app from '../app';
import quejaDAO from '../DAO/queja';
import jwt from 'jsonwebtoken';

jest.mock('../DAO/queja');

describe('Queja Controller - prioridadQueja', () => {
    let tokenAdmin, tokenUser;

    beforeAll(() => {
        tokenAdmin = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                rol: 2
            },
            'secret'
        );

        tokenUser = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                rol: 1
            },
            'secret'
        );
    });

    it('Debe retornar status 500 cuando hay error con la base de datos', async () => {
        quejaDAO.updatePrioridad.mockImplementation(() => {
            throw new Error('Database not running');
        });

        const response = await request(app)
            .post('/queja/prioridadQueja/1')
            .set('Cookie', `myToken=${tokenAdmin}`)
            .send({ prioridad: 1 });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error al actualizar prioridad');
    });

    it('Debe retornar status 401 cuando el token no se encuentra', async () => {
        const response = await request(app)
            .post('/queja/prioridadQueja/1')
            .send({ prioridad: 1 });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'No se encontró el token');
    });

    it('Debe retornar status 401 cuando el token es invalido', async () => {
        const invalidToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                rol: 1
            },
            'invalid_secret'
        );

        const response = await request(app)
            .post('/queja/prioridadQueja/1')
            .set('Cookie', `myToken=${invalidToken}`)
            .send({ prioridad: 1 });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('Debe retornar status 401 cuando el usuario no es administrador', async () => {
        const response = await request(app)
            .post('/queja/prioridadQueja/1')
            .set('Cookie', `myToken=${tokenUser}`)
            .send({ prioridad: 1 });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Usuario no es administrador');
    });

    it('Debe retornar status 200 y actualizar la prioridad satisfactoriamente', async () => {
        quejaDAO.updatePrioridad.mockResolvedValue({
            id: 1,
            prioridad: 1
        });

        const response = await request(app)
            .post('/queja/prioridadQueja/1')
            .set('Cookie', `myToken=${tokenAdmin}`)
            .send({ prioridad: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Prioridad actualizada con éxito');
        expect(response.body.queja).toHaveProperty('prioridad', 1);
    });
});
