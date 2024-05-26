import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

import Rol from './rol.js'
import Sexo from './sexo.js'

const Usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50)
    },
    password: {
        type: DataTypes.STRING(100)
    },
    nombre: {
        type: DataTypes.STRING(50)
    },
    apellido_paterno: {
        type: DataTypes.STRING(50)
    },
    apellido_materno: {
        type: DataTypes.STRING(50)
    },
    foto: {
        type: DataTypes.TEXT
    },
    rol_id: {
        type: DataTypes.INTEGER
    },
    sexo_id: {
        type: DataTypes.INTEGER
    }
})

Usuario.belongsTo(Rol, {
    foreignKey: 'rol_id',
    targetId: 'id'
});
Usuario.belongsTo(Sexo, {
    foreignKey: 'sexo_id',
    targetId: 'id'
});


export default Usuario