import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

import Usuario from './usuario.js'
import Municipalidad from './municipalidad.js';

const Administrador = sequelize.define('administrador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER
    },
    municipalidad_id: {
        type: DataTypes.INTEGER
    }
})

Administrador.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    targetId: 'id'
});
Administrador.belongsTo(Municipalidad, {
    foreignKey: 'municipalidad_id',
    targetId: 'id'
});

export default Administrador