jest.mock('../DAO/token'); // Indica a Jest que use el mock para tokenDAO

const request = require('supertest');
const app = require('../app').default; // Importar la aplicación exportada por defecto
const tokenDAO = require('../DAO/token').default; // Importar el mock del DAO para token
const nodemailer = require('nodemailer'); // Importar nodemailer
const { google } = require('googleapis'); // Importar googleapis

jest.mock('nodemailer'); // Mock de nodemailer
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockReturnValue({
        setCredentials: jest.fn(),
        getAccessToken: jest.fn().mockResolvedValue({ token: 'fake-access-token' })
      })
    }
  }
}));

describe('Token Controller', () => {
  let transporterMock;

  beforeEach(() => {
    transporterMock = {
      sendMail: jest.fn()
    };
    nodemailer.createTransport.mockReturnValue(transporterMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a token email successfully', async () => {
    const email = 'test@example.com';

    tokenDAO.findOneByEmail.mockResolvedValue(null); // Mock para no encontrar un token existente
    tokenDAO.create.mockResolvedValue({ id: 1 }); // Mock para crear un nuevo token
    transporterMock.sendMail.mockResolvedValue(true); // Mock para enviar email

    const response = await request(app)
      .post('/token/sendtoken') // Usa la ruta correcta
      .send({ email });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Email sent successfully');
  });

  it('should fail to send a token email if email service fails', async () => {
    const email = 'test@example.com';

    tokenDAO.findOneByEmail.mockResolvedValue(null); // Mock para no encontrar un token existente
    transporterMock.sendMail.mockRejectedValue(new Error('Email service failed')); // Mock para fallo en envío de email

    const response = await request(app)
      .post('/token/sendtoken') // Usa la ruta correcta
      .send({ email });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Failed to send email');
  });

  it('should verify a token successfully', async () => {
    const email = 'test@example.com';
    const token = '123456';

    tokenDAO.findOneByEmail.mockResolvedValue({
      id: 1,
      email,
      token,
      createdAt: new Date(Date.now() - 5 * 60000) // Mock de token creado hace 5 minutos
    });

    const response = await request(app)
      .post('/token/verifytoken') // Usa la ruta correcta
      .send({ email, token });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Correo verificado');
  });

  it('should fail to verify a token if it is incorrect', async () => {
    const email = 'test@example.com';
    const token = '123456';

    tokenDAO.findOneByEmail.mockResolvedValue({
      id: 1,
      email,
      token: 'wrong-token',
      createdAt: new Date(Date.now() - 5 * 60000) // Mock de token creado hace 5 minutos
    });

    const response = await request(app)
      .post('/token/verifytoken') // Usa la ruta correcta
      .send({ email, token });

    expect(response.statusCode).toBe(300);
    expect(response.body).toHaveProperty('message', 'Token incorrecto');
  });

  it('should fail to verify a token if it has expired', async () => {
    const email = 'test@example.com';
    const token = '123456';

    tokenDAO.findOneByEmail.mockResolvedValue({
      id: 1,
      email,
      token,
      createdAt: new Date(Date.now() - 15 * 60000) // Mock de token creado hace 15 minutos
    });

    const response = await request(app)
      .post('/token/verifytoken') // Usa la ruta correcta
      .send({ email, token });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'El token ha expirado');
  });
});
