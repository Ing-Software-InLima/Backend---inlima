import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Municipalidad = sequelize.define('municipalidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(70)
    }
});

export default Municipalidad;