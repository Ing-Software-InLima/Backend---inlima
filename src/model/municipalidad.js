import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Administrador from './administrador.js';

const Municipalidad = sequelize.define('municipalidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(70)
    },
    administrador_id: {
        type: DataTypes.INTEGER
    }
})

Municipalidad.belongsTo(Administrador, {
    foreignKey: 'administrador_id',
    targetId: 'id'
});

export default Municipalidad;