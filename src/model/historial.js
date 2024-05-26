import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

import Queja from './queja.js'
import Estado from './estado.js'
import Administrador from './administrador.js'

const Historial = sequelize.define('historial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE
    },
    administrador_id: {
        type: DataTypes.INTEGER
    },
    queja_id: {
        type: DataTypes.INTEGER
    },
    estado_id: {
        type: DataTypes.INTEGER
    },
})

Historial.belongsTo(Administrador, {
    foreignKey: 'administrador_id',
    targetId: 'id'
});
Historial.belongsTo(Queja, {
    foreignKey: 'queja_id',
    targetId: 'id'
});
Historial.belongsTo(Estado, {
    foreignKey: 'estado_id',
    targetId: 'id'
});

export default Historial