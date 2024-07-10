jest.mock('../DAO/ciudadano'); // Mock ciudadanoDAO
jest.mock('../DAO/queja'); // Mock quejaDAO

const request = require('supertest');
const app = require('../app').default; // Importar la aplicación exportada por defecto
const ciudadanoDAO = require('../DAO/ciudadano').default; // Importar el mock del DAO para ciudadano
const quejaDAO = require('../DAO/queja').default; // Importar el mock del DAO para queja
const jwt = require('jsonwebtoken');

describe('Queja Controller - getQuejasUsuario', () => {
  let token;

  beforeAll(() => {
    // Crear un token válido
    token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        id: 53 // Usando el ID específico de usuario
      },
      'secret'
    );
  });

  it('Debe retornar status 401 cuando no se encuentra un token de cookie', async () => {
    const response = await request(app)
      .get('/queja/quejasUsuario')
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'No se encontró el token');
  });

  it('Debe retornar status 401 cuando el token de la cookie es inválido', async () => {
    const invalidToken = 'invalid.token.here';
    const response = await request(app)
      .get('/queja/quejasUsuario')
      .set('Cookie', `myToken=${invalidToken}`)
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  it('Debe retornar status 500 cuando hay un error con la base de datos', async () => {
    ciudadanoDAO.findOneByUserID.mockResolvedValue({ id: 53 });
    quejaDAO.findAllbyCiudadanoID.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/queja/quejasUsuario')
      .set('Cookie', `myToken=${token}`)
      .send();

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Database error');
  });

  it('Debe retornar status 200 y retornar el listado de quejas', async () => {
    ciudadanoDAO.findOneByUserID.mockResolvedValue({ id: 53 });
    quejaDAO.findAllbyCiudadanoID.mockResolvedValue([
      {
        id: 1,
        asunto: 'Queja 1',
        descripcion: 'Descripción 1',
        estado_id: 1,
        ciudadano_id: 53,
        municipalidad_id: 1
      },
      {
        id: 2,
        asunto: 'Queja 2',
        descripcion: 'Descripción 2',
        estado_id: 2,
        ciudadano_id: 53,
        municipalidad_id: 1
      }
    ]);

    const response = await request(app)
      .get('/queja/quejasUsuario')
      .set('Cookie', `myToken=${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('id', 1);
    expect(response.body[0]).toHaveProperty('asunto', 'Queja 1');
    expect(response.body[1]).toHaveProperty('id', 2);
    expect(response.body[1]).toHaveProperty('asunto', 'Queja 2');
  });
});
