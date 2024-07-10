// src/tests/usuario.test.js
import request from 'supertest';
import app from '../app.js';
import usuarioDAO from '../DAO/usuario.js';

jest.mock('../DAO/usuario.js');

describe('Usuario Controller - iniciarSesion', () => {
  it('Debe retornar status 200 y establecer una cookie cuando el login es exitoso', async () => {
    usuarioDAO.findOneByEmail.mockResolvedValue({ email: 'test@example.com', password: 'password', rol_id: 1, id: 1, nombre: 'Test User' });

    const response = await request(app)
      .post('/usuario/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Inicio de sesión exitoso');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('Debe retornar status 401 cuando ni el correo ni la contraseñas existen en la base de datos', async () => {
    usuarioDAO.findOneByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post('/usuario/login')
      .send({ email: 'nonexistent@example.com', password: 'password' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
  });

  it('Debe retornar status 500 cuando la base de datos no está funcionando correctamente', async () => {
    usuarioDAO.findOneByEmail.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/usuario/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Database error');
  });
});
