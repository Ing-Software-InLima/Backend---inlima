const ciudadanoDAO = {
    findAll: jest.fn(),
    findOneByUserID: jest.fn(),
    findAllbyID: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    // Puedes agregar otros métodos mock si es necesario
  };
  
  export default ciudadanoDAO;
  