jest.mock('../DAO/ciudadano'); // Indica a Jest que use el mock para ciudadanoDAO
jest.mock('../DAO/queja'); // Indica a Jest que use el mock para quejaDAO

const request = require('supertest');
const app = require('../app').default; // Importar la aplicación exportada por defecto
const quejaDAO = require('../DAO/queja').default; // Importar el mock del DAO para queja
const ciudadanoDAO = require('../DAO/ciudadano').default; // Importar el mock del DAO para ciudadano
const jwt = require('jsonwebtoken');

describe('Queja Controller', () => {
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

  it('Debe retornar status 500 cuando la base de datos no está funcionando correctamente', async () => {
    // Simular que la base de datos no está corriendo
    ciudadanoDAO.findOneByUserID.mockRejectedValue(new Error('Database not running'));
    const response = await request(app)
      .post('/queja/create')
      .set('Cookie', `myToken=${token}`)
      .send({
        asunto: 'Queja de prueba',
        descripcion: 'Descripción de prueba',
        foto: 'foto.jpg',
        ubicacion_descripcion: 'Ubicación de prueba',
        latitud: -12.0464,
        longitud: -77.0428,
        municipalidad: 1
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Database not running');
  });

  it('Debe retornar status 401 cuando el token de la cookie no se encuentre', async () => {
    const response = await request(app)
      .post('/queja/create')
      .send({
        asunto: 'Queja de prueba',
        descripcion: 'Descripción de prueba',
        foto: 'foto.jpg',
        ubicacion_descripcion: 'Ubicación de prueba',
        latitud: -12.0464,
        longitud: -77.0428,
        municipalidad: 1
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'No se encontró el token');
  });

  it('Debe retornar status 401 cuando no se encuentra el id del usuario en la base de datos', async () => {
    ciudadanoDAO.findOneByUserID.mockResolvedValue(null);
    const response = await request(app)
      .post('/queja/create')
      .set('Cookie', `myToken=${token}`)
      .send({
        asunto: 'Queja de prueba',
        descripcion: 'Descripción de prueba',
        foto: 'foto.jpg',
        ubicacion_descripcion: 'Ubicación de prueba',
        latitud: -12.0464,
        longitud: -77.0428,
        municipalidad: 1
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Ciudadano no encontrado');
  });

  it('Debe retornar status 200 y registrar la queja', async () => {
    ciudadanoDAO.findOneByUserID.mockResolvedValue({
      id: 53 // Usando el ID específico de usuario
    });

    quejaDAO.create.mockResolvedValue({
      id: 64, // Usando el ID específico de queja
      asunto: 'Queja de prueba',
      descripcion: 'Descripción de prueba',
      foto: 'foto.jpg',
      ubicacion_descripcion: 'Ubicación de prueba',
      latitud: -12.0464,
      longitud: -77.0428,
      fecha: new Date(),
      estado_id: 1,
      ciudadano_id: 53,
      municipalidad_id: 1
    });

    const newQueja = {
      asunto: 'Queja de prueba',
      descripcion: 'Descripción de prueba',
      foto: 'foto.jpg',
      ubicacion_descripcion: 'Ubicación de prueba',
      latitud: -12.0464,
      longitud: -77.0428,
      municipalidad: 1
    };

    const response = await request(app)
      .post('/queja/create')
      .set('Cookie', `myToken=${token}`)
      .send(newQueja);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Queja enviada');
    expect(response.body.data).toHaveProperty('id', 64);
    expect(response.body.data).toHaveProperty('asunto', 'Queja de prueba');
    expect(response.body.data).toHaveProperty('descripcion', 'Descripción de prueba');
    expect(response.body.data).toHaveProperty('foto', 'foto.jpg');
    expect(response.body.data).toHaveProperty('ubicacion_descripcion', 'Ubicación de prueba');
    expect(response.body.data).toHaveProperty('latitud', -12.0464);
    expect(response.body.data).toHaveProperty('longitud', -77.0428);
    expect(response.body.data).toHaveProperty('estado_id', 1);
    expect(response.body.data).toHaveProperty('ciudadano_id', 53);
    expect(response.body.data).toHaveProperty('municipalidad_id', 1);
  });
});
