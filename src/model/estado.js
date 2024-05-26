import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Estado = sequelize.define('estado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(40)
    }
});

export default Estado;