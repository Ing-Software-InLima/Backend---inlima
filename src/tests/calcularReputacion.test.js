import request from 'supertest';
import app from '../app'; // Ajusta la ruta según la estructura de tu proyecto

describe('Ciudadano Controller', () => {
    test('Debe calcular reputación con ciudadano válido y quejas con calificaciones', async () => {
        const response = await request(app)
            .post('/ciudadano/calcularReputacion') // Ajusta la ruta según tu configuración
            .send({ id_ciudadano: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Reputación calculada correctamente.');
        expect(response.body).toHaveProperty('ciudadano');
        expect(response.body.ciudadano).toHaveProperty('id', 1);
        expect(response.body.ciudadano).toHaveProperty('dni', '46623672');
        expect(response.body.ciudadano).toHaveProperty('numero', '999111222');
        expect(response.body.ciudadano).toHaveProperty('usuario_id', 1);
        expect(response.body.ciudadano).toHaveProperty('reputacion', 0);
    });

    test('Debe calcular la reputación con ciudadano válido y no quejas con calificaciones', async () => {
        const response = await request(app)
            .post('/ciudadano/calcularReputacion')
            .send({ id_ciudadano: 51 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Reputación calculada correctamente.');
        expect(response.body).toHaveProperty('ciudadano');
        expect(response.body.ciudadano).toHaveProperty('id', 51); // Ajusta según el ciudadano y datos esperados
        expect(response.body.ciudadano).toHaveProperty('dni', '73903454');
        expect(response.body.ciudadano).toHaveProperty('numero', '999888999');
        expect(response.body.ciudadano).toHaveProperty('usuario_id', 53);
        expect(response.body.ciudadano).toHaveProperty('reputacion', 0);
    });

    test('Debería devolver error por identificación de ciudadano no válida', async () => {
        const response = await request(app)
            .post('/ciudadano/calcularReputacion')
            .send({ id_ciudadano: 999 }); // ID que no existe

        expect(response.statusCode).toBe(404); // Ajusta el código de estado esperado según tu implementación
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Ciudadano no encontrado');
    });

    test('Debe manejar errores inesperados', async () => {
        const response = await request(app)
            .post('/ciudadano/calcularReputacion')
            .send({ id_ciudadano: 'abc' }); // ID inválido (no numérico)

        expect(response.statusCode).toBe(404); 
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Ciudadano no encontrado');
    });
    
});
