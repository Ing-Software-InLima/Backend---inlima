import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

import Usuario from './usuario.js'

const Ciudadano = sequelize.define('ciudadano', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(15)
    },
    numero: {
        type: DataTypes.STRING(15)
    },
    usuario_id: {
        type: DataTypes.INTEGER
    },
    reputacion: {
        type: DataTypes.FLOAT
    }
})

Ciudadano.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    targetId: 'id'
});

export default Ciudadano