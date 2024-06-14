// DAO/queja.js
import RepositoryBase from "../repository/base.js";
import modelo from '../model/queja.js';
import Ciudadano from '../model/ciudadano.js'
import Municipalidad from '../model/municipalidad.js'
import Estado from '../model/estado.js'

const quejaRepository = new RepositoryBase(modelo);

const findAll = async () => {
    return await quejaRepository.findAll();
};

const findAllbyCiudadanoID = async (ciudadano_id) => {
    try {
        return await modelo.findAll({
            where: { ciudadano_id },
            include: [
                { model: Estado},
                { model: Ciudadano, attributes: ['dni'] },
                { model: Municipalidad},
            ]
        })
    }
    catch(err) {
        console.error(err);
        return null;
    }
};

const create = async (data) => {
    return await quejaRepository.create(data);
};

const findOne = async (id) => {
    return await quejaRepository.findOne(id);
};

const update = async (data) => {
    return await quejaRepository.update(data);
};

const remove = async (id) => {
    return await quejaRepository.remove(id);
};

const ASUNTOS_PREDEFINIDOS = [
    "Veredas rotas", "Calles contaminadas", "Poste de luces apagadas",
    "Construcción sin licencia", "Comercio ilegal", "Invasión no autorizada de lugares públicos",
    "Árboles obstruyen la circulación", "Vehículo abandonado", "Mascota perdida",
    "Inmueble abandonado", "Propiedad en mal estado"
];

const findFiltered = async (asuntos, municipalidad) => {
    try {
        console.log("FUNCION EN DAO", asuntos, municipalidad);

        let whereConditions = {};

        // Condiciones para asuntos
        if (asuntos.length > 0) {
            const contieneOtros = asuntos.includes('Otros');
            const otrosAsuntos = asuntos.filter(asunto => asunto !== 'Otros');

            // Condición para "Otros"
            if (contieneOtros) {
                if (otrosAsuntos.length > 0) {
                    whereConditions = {
                        ...whereConditions,
                        [Symbol.for('or')]: [
                            { asunto: { [Symbol.for('notIn')]: ASUNTOS_PREDEFINIDOS } },
                            { asunto: { [Symbol.for('in')]: otrosAsuntos } }
                        ]
                    };
                } else {
                    whereConditions = {
                        ...whereConditions,
                        asunto: { [Symbol.for('notIn')]: ASUNTOS_PREDEFINIDOS }
                    };
                }
            } else if (otrosAsuntos.length > 0) {
                whereConditions = {
                    ...whereConditions,
                    asunto: { [Symbol.for('in')]: otrosAsuntos }
                };
            }
        }

        // Condición para municipalidad
        if (municipalidad) {
            whereConditions = {
                ...whereConditions,
                municipalidad_id: municipalidad
            };
        }

        console.log('whereConditions:', whereConditions);

        const respuesta = await modelo.findAll({
            where: whereConditions,
            include: [
                { model: Estado },
                { model: Ciudadano },
                { model: Municipalidad },
            ]
        });
        console.log("respuesta", respuesta);

        if (respuesta) {
            const datavaluesArray = respuesta.map(queja => queja.dataValues);
            return datavaluesArray;
        } else {
            return [];
        }

    } catch (error) {
        console.error('Error en findFiltered:', error);
        return null;
    }
};

const findOneByCiudadanoId = async (id) => {
    try {
        return await modelo.findOne({
            where: { id },
            include: [
                { model: Estado, attributes: ['nombre'] },
                { model: Ciudadano, attributes: ['dni'] },
                { model: Municipalidad, attributes: ['nombre'] },
            ]
        });
    } catch (err) {
        console.error(err);
        return null;
    }
};

const updateEstado = async (id, estado_id) => {
    try {
        const queja = await findOne(id);
        if (!queja) {
            throw new Error('Queja no encontrada.');
        }
        queja.estado_id = estado_id;
        await queja.save();
        return queja;
    } catch (error) {
        throw new Error(error.message);
    }
};

const quejaDAO = { findAll, findAllbyCiudadanoID, create, findOne, update, remove , findFiltered, findOneByCiudadanoId, updateEstado};

export default quejaDAO;