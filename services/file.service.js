const repo = require('../repositories/file.repo');
const knex = require('../db');

module.exports.createFileService = async (fileName, groupId, id) => {
    try {
        return await repo.createFileRepo(fileName, groupId, id);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.importService = async (fileName) => {
    try {
        return await repo.importRepo(fileName);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getImportFile = async () => {
    try {
        return await repo.getImportFile();
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getNot = async () => {
    try {
        return await repo.getNot();
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getFileHistoryservice = async (fileId) => {
    try {
        return await repo.getFileHistoryRepo(fileId);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.updatetheFileService = async (fileName, fileId, id) => {
    try {
        return await repo.updatetheFileRepo(fileName, fileId, id);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.checksFileService = async (files, id) => {
    try {
        for (let i = 0; i < files.length; i++) {
            const groupId = await knex('files').select('groupId').where('id', files[i]).first();
            const check = await knex('userGroups').where('group_id', groupId.groupId).andWhere('user_id', id).first();
            if (!check) {
                throw  new Error('you can not make this action');
            }
        }
        await repo.checksFilesRepo(files , id) ;
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.checkoutFileService = async (fileId , id) => {
    try {
         return await repo.checkOutRepo(fileId , id) ;
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.downloadFileService = async (fileId , id) => {
    try {
         return await repo.downloadFileRepo(fileId , id) ;
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.exportService = async (type , id , fileType , res , req) => {
    try {
        return await repo.exportRepo(type , id , fileType , res , req);
    } catch (e) {
        throw new Error(e.message);
    }
}