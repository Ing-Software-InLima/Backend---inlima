import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Sexo = sequelize.define('sexo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(9)
    }
})

export default Sexo;