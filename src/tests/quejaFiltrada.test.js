jest.mock('../DAO/administrador'); // Mock administradorDAO
jest.mock('../DAO/queja'); // Mock quejaDAO

const request = require('supertest');
const app = require('../app').default; // Importar la aplicación exportada por defecto
const administradorDAO = require('../DAO/administrador').default; // Importar el mock del DAO para administrador
const quejaDAO = require('../DAO/queja').default; // Importar el mock del DAO para queja
const jwt = require('jsonwebtoken');

describe('Queja Controller - obtenerQuejasFiltradas', () => {
  let token;

  beforeAll(() => {
    // Crear un token válido
    token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        id: 9 // Usando el ID específico de usuario
      },
      'secret'
    );
  });

  it('Debe retornar status 401 cuando no se encuentra un token de cookie', async () => {
    const response = await request(app)
      .post('/queja/search')
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'No se encontró el token');
  });

  it('Debe retornar status 200 y filtrar quejas por asunto y municipalidad predefinidos', async () => {
    administradorDAO.findOneByUserID.mockResolvedValue({ municipalidad_id: 33 });
    quejaDAO.findFiltered.mockResolvedValue([{ asunto: 'Veredas rotas' }]);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: ["Veredas rotas"] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Veredas rotas');
  });

  it('Debe retornar status 200 y filtrar quejas por el asunto "Otros"', async () => {
    administradorDAO.findOneByUserID.mockResolvedValue({ municipalidad_id: 33 });
    quejaDAO.findFiltered.mockResolvedValue([{ asunto: 'Otro asunto' }]);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: ["Otros"] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Otro asunto');
  });

  it('Debe retornar status 200 y filtrar quejas sin filtro de asunto', async () => {
    administradorDAO.findOneByUserID.mockResolvedValue({ municipalidad_id: 33 });
    quejaDAO.findFiltered.mockResolvedValue([{ asunto: 'Construcción sin licencia' }]);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: [] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Construcción sin licencia');
  });

  it('Debe retornar status 200 y filtrar sin municipalidad', async () => {
    quejaDAO.findFiltered.mockResolvedValue([{ asunto: 'Inmueble abandonado' }]);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: ["Inmueble abandonado"] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Inmueble abandonado');
  });

  it('Debe retornar status 500 cuando hay un error en la base de datos', async () => {
    administradorDAO.findOneByUserID.mockRejectedValue(new Error('Database error'));
  
    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send();
  
      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Database error');
    });
});
