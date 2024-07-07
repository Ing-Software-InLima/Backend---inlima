jest.mock('../DAO/usuario'); // Indica a Jest que use el mock para usuarioDAO

const request = require('supertest');
const app = require('../app').default; // Importar la aplicación exportada por defecto
const usuarioDAO = require('../DAO/usuario').default; // Importar el mock del DAO para usuario
const jwt = require('jsonwebtoken');

describe('Usuario Controller', () => {
  it('should log in a user successfully', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      rol_id: 2,
      nombre: 'Test User'
    };

    usuarioDAO.findOneByEmail.mockResolvedValue(user);

    const response = await request(app)
      .post('/usuario/login') // Asegúrate de usar la ruta correcta
      .send({ email: user.email, password: user.password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Inicio de sesión exitoso');
  });

  it('should fail to log in a user with incorrect credentials', async () => {
    usuarioDAO.findOneByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post('/usuario/login') // Asegúrate de usar la ruta correcta
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
  });

  it('should log in a user successfully with Google', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      rol_id: 2,
      nombre: 'Test User',
      foto: 'url_to_photo'
    };

    usuarioDAO.findOneByEmail.mockResolvedValue(user);

    const response = await request(app)
      .post('/usuario/loginGoogle') // Asegúrate de usar la ruta correcta
      .send({ email: user.email });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Inicio de sesión exitoso');
  });

  it('should fail to log in a user with Google if not registered', async () => {
    usuarioDAO.findOneByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post('/usuario/loginGoogle') // Asegúrate de usar la ruta correcta
      .send({ email: 'test@example.com' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
  });
});
