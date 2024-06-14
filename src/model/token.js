import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Token = sequelize.define('token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50)
    },
    token: {
        type: DataTypes.STRING(10)
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
});

export default Token;