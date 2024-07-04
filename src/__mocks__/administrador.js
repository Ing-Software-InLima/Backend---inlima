const administradorDAO = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByUserID: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    // Otros métodos mock si es necesario
  };
  
export default administradorDAO;