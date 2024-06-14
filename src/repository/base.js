class RepositoryBase {
    constructor(modelo) {
        this.modelo = modelo;
    }

    findAll = async (props = {}) => {
        try {
            const result = await this.modelo.findAll(props);
            return result;
        } catch(err) {
            console.error(err);
            return null;
        }
        
    }

    create = async (object) => {
        try {
            return await this.modelo.create(object)
        } catch(err) {
            console.error(err);
            return null;
        }
        
    }

    findOne = async (id) => {
        try {
            return await this.modelo.findOne({
                where: { id }
            })
        }
        catch(err) {
            console.error(err);
            return null;
        }
    }

    update = async (object) => {
        const { id, ...data } = object.dataValues;
        try {
            const record = await this.modelo.findOne({ where: { id } });

            if (!record) {
                return null;
            }
            Object.assign(record, data);
            await record.save();
            return record;

        } catch (err) {
            console.error('Error al actualizar la queja:', err);
            return null;
        }
    }

    remove = async (id) => {
        try {
            await this.modelo.destroy({
                where: {
                    id
                }
            })
            return true;
        } catch (err) {
            console.error(err)
            return null
        }
    
    }


}

export default RepositoryBase;