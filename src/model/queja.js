import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

import Estado from './estado.js'
import Ciudadano from './ciudadano.js'
import Municipalidad from './municipalidad.js'

const Queja = sequelize.define('queja', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    asunto: {
        type: DataTypes.STRING(150)
    },
    descripcion: {
        type: DataTypes.STRING(1500)
    },
    foto: {
        type: DataTypes.TEXT
    },
    ubicacion_descripcion: {
        type: DataTypes.STRING(150)
    },
    latitud: {
        type: DataTypes.FLOAT
    },
    longitud: {
        type: DataTypes.FLOAT
    },
    fecha: {
        type: DataTypes.DATE
    },
    estado_id: {
        type: DataTypes.INTEGER
    },
    ciudadano_id: {
        type: DataTypes.INTEGER
    },
    municipalidad_id: {
        type: DataTypes.INTEGER
    },
    calificacion: {
        type: DataTypes.INTEGER
    },
    prioridad: {
        type: DataTypes.INTEGER
    }
})

Queja.belongsTo(Estado, {
    foreignKey: 'estado_id',
    targetId: 'id'
});
Queja.belongsTo(Ciudadano, {
    foreignKey: 'ciudadano_id',
    targetId: 'id'
});
Queja.belongsTo(Municipalidad, {
    foreignKey: 'municipalidad_id',
    targetId: 'id'
});
Ciudadano.hasMany(Queja,{
    foreignKey: "ciudadano_id",
    targetId: "id"
});

export default Queja