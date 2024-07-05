jest.mock('../DAO/usuario'); // Indica a Jest que use el mock para usuarioDAO
jest.mock('../DAO/ciudadano'); // Indica a Jest que use el mock para ciudadanoDAO

const request = require('supertest');
const app = require('../app').default; // Importar la aplicación exportada por defecto
const usuarioDAO = require('../DAO/usuario').default; // Importar el mock del DAO para usuario
const ciudadanoDAO = require('../DAO/ciudadano').default; // Importar el mock del DAO para ciudadano

describe('Ciudadano Controller', () => {
  it('should register a user successfully', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
      nombre: 'Test',
      apellido_paterno: 'User',
      apellido_materno: 'Example',
      dni: '12345678',
      sexo: 1,
      foto: 'url_to_photo',
      numero: '987654321'
    };

    usuarioDAO.findOneByEmail.mockResolvedValue(null); // Mock para usuario no existente
    usuarioDAO.create.mockResolvedValue({ id: 1 }); // Mock para crear usuario
    ciudadanoDAO.create.mockResolvedValue({ id: 1 }); // Mock para crear ciudadano

    const response = await request(app)
      .post('/ciudadano/signin') // Asegúrate de usar la ruta correcta
      .send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Usuario creado exitosamente');
  });

  it('should fail to register an existing user', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
      nombre: 'Test',
      apellido_paterno: 'User',
      apellido_materno: 'Example',
      dni: '12345678',
      sexo: 1,
      foto: 'url_to_photo',
      numero: '987654321'
    };

    usuarioDAO.findOneByEmail.mockResolvedValue(user); // Mock para usuario existente

    const response = await request(app)
      .post('/ciudadano/signin') // Asegúrate de usar la ruta correcta
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'El usuario ya ha sido registrado. Intenté con otro correo.');
  });

  it('should register a user successfully with Google', async () => {
    const user = {
      email: 'test@example.com',
      nombre: 'Test',
      apellido_paterno: 'User',
      apellido_materno: 'Example',
      dni: '12345678',
      sexo: 1,
      foto: 'url_to_photo',
      numero: '987654321'
    };

    usuarioDAO.findOneByEmail.mockResolvedValue(null); // Mock para usuario no existente
    usuarioDAO.create.mockResolvedValue({ id: 1 }); // Mock para crear usuario
    ciudadanoDAO.create.mockResolvedValue({ id: 1 }); // Mock para crear ciudadano

    const response = await request(app)
      .post('/ciudadano/signinGoogle') // Asegúrate de usar la ruta correcta
      .send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Usuario creado exitosamente');
  });

  it('should fail to register an existing user with Google', async () => {
    const user = {
      email: 'test@example.com',
      nombre: 'Test',
      apellido_paterno: 'User',
      apellido_materno: 'Example',
      dni: '12345678',
      sexo: 1,
      foto: 'url_to_photo',
      numero: '987654321'
    };

    usuarioDAO.findOneByEmail.mockResolvedValue(user); // Mock para usuario existente

    const response = await request(app)
      .post('/ciudadano/signinGoogle') // Asegúrate de usar la ruta correcta
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'El usuario ya ha sido registrado. Intenté con otro correo.');
  });
});
