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
    const quejasMock = [
      {
        id: 1,
        asunto: 'Veredas rotas',
        descripcion: 'He encontrado esta vereda en la avenida el aire de san luis, que está en muy estado y quisiera que se arreglase para evitar accidentes.',
        foto: 'https://www.tiempoar.com.ar/wp-content/uploads/2021/05/60880_web-vebeda-bota_BIG.jpg',
        ubicacion_descripcion: 'Av del Aire 807, San Luis 15021',
        latitud: -12080651241941800,
        longitud: -7700422109123510,
        fecha: '2024-05-22T19:30:00.000Z',
        estado_id: 1,
        ciudadano_id: 1,
        municipalidad_id: 33,
        calificacion: null,
        prioridad: null
      }
    ];
    administradorDAO.findOneByUserID.mockResolvedValue({ municipalidad_id: 33 });
    quejaDAO.findFiltered.mockResolvedValue(quejasMock);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: ["Veredas rotas"] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Veredas rotas');
    expect(response.body[0]).toMatchObject(quejasMock[0]);
  });

  it('Debe retornar status 200 y filtrar quejas por el asunto "Otros"', async () => {
    administradorDAO.findOneByUserID.mockResolvedValue({ municipalidad_id: 33 });
    quejaDAO.findFiltered.mockResolvedValue([]);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: ["Otros"] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('Debe retornar status 200 y filtrar quejas sin filtro de asunto', async () => {
    const quejasMock = [
      {
        id: 3,
        asunto: 'Vehículo abandonado',
        descripcion: 'He encontrado este vehículo abandonado en la avenida el aire de san luis, que está en muy estado y quisiera que se arreglase para evitar accidentes.',
        foto: 'https://www.tiempoar.com.ar/wp-content/uploads/2021/05/60880_web-vebeda-bota_BIG.jpg',
        ubicacion_descripcion: 'Av del Aire 813, San Luis 15023',
        latitud: -12080651241941800,
        longitud: -7700422109123510,
        fecha: '2024-05-22T21:30:00.000Z',
        estado_id: 1,
        ciudadano_id: 1,
        municipalidad_id: 33,
        calificacion: null,
        prioridad: null
      }
    ];
    administradorDAO.findOneByUserID.mockResolvedValue({ municipalidad_id: 33 });
    quejaDAO.findFiltered.mockResolvedValue(quejasMock);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: [] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Vehículo abandonado');
    expect(response.body[0]).toMatchObject(quejasMock[0]);
  });

  it('Debe retornar status 200 y filtrar quejas sin parametro municipalidad', async () => {
    const quejasMock = [
      {
        id: 4,
        asunto: 'Mascota perdida',
        descripcion: 'He encontrado esta mascota perdida en la avenida el aire de san luis.',
        foto: 'https://www.tiempoar.com.ar/wp-content/uploads/2021/05/60880_web-vebeda-bota_BIG.jpg',
        ubicacion_descripcion: 'Av del Aire 827, San Luis 15024',
        latitud: -12080651241941800,
        longitud: -7700422109123510,
        fecha: '2024-05-22T22:30:00.000Z',
        estado_id: 1,
        ciudadano_id: 1,
        municipalidad_id: 33,
        calificacion: null,
        prioridad: null
      }
    ];
    quejaDAO.findFiltered.mockResolvedValue(quejasMock);

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send({ asuntos: ["Mascota perdida"] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('asunto', 'Mascota perdida');
    expect(response.body[0]).toMatchObject(quejasMock[0]);
  });

  it('Debe retornar status 500 cuando hay un error en la base de datos', async () => {
    administradorDAO.findOneByUserID.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/queja/search')
      .set('Cookie', `myToken=${token}`)
      .send();

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Database error');
  });
});
