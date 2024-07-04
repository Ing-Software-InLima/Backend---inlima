const quejaDAO = {
    findAll: jest.fn(),
    findAllbyCiudadanoID: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findFiltered: jest.fn(),
    updateEstado: jest.fn(),
    // Otros métodos mock si es necesario
  };
  
export default quejaDAO;