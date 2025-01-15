const knex = require('../db') ;

module.exports.createGroupRepo = async (id , name) => {
    try {
        const groupId =  await knex('groups').insert({
            'adminId' : id ,
            'name' : name
        }) ;
        await knex('userGroups').insert({
            'group_id':groupId ,
            'user_id':id
        }) ;
        return groupId ;
    } catch (e) {
        throw new Error('An Error Occurred') ;
    }
}

module.exports.getGroupRepo = async () => {
    try {
        const groups =  await knex('groups');
        return groups;
    } catch (e) {
        throw new Error('An Error Occurred') ;
    }
}

module.exports.getMyGroupRepo = async (id) => {
    try {
        const groups =  await knex('groups').where('adminId' , id);
        return groups;
    } catch (e) {
        throw new Error('An Error Occurred') ;
    }
}

module.exports.getFileByGroupRepo = async (groupId, page) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;
        const files =  await knex('files').where('groupID' , groupId).limit(limit).offset(offset);
        const totalItems = await knex('files').where('groupID',groupId)
            .count('* as count').first();
        const totalPages = Math.ceil(totalItems.count / limit);

        return {
            files,
            informationToUse: {
                ThenumberOfItem: totalItems.count,
                ThenumberOfPages: totalPages,
                currentPage: page,
                FileInThePage: limit,
            },
        };
    } catch (e) {
        throw new Error('An Error Occurred') ;
    }
}


module.exports.EditGroupNameRepo = async (groupId, name) => {
    try {
        const groupName =  await knex('groups').where('id',groupId).update({ name });
        return groupName;
    } catch (e) {
        throw new Error('An Error Occurred') ;
    }
}