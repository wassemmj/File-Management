const knex = require('../db') ;
const User = require('../models/user.model') ;
const colorette = require("colorette");

module.exports.createUserRepo = async (newUser) => {
    try {
        const user = new User(newUser);
        return user.save();
    } catch (e) {
        throw new Error('Failed to save user to the database');
    }
}

module.exports.loginRepo = async (user) => {
    try {
        const users = await knex('users').where('email' , user.email).first() ;

        if (!users) {
            throw new Error('there is no user with this email');
        }

        return users ;
    } catch (e) {
        throw new Error('Failed to save user to the database');
    }
}

module.exports.getUserRepo = async (id)=>{
    try{
        return await knex('users').select('id','name').where('id' , '!=' , id);
    }catch (e){
        throw new Error('Failed to save user to the database');
    }
}


module.exports.getUsersInGroupRepo = async (groupId)=>{
    try{
        const UserID = await knex('userGroups').select('user_id').where('group_id' , groupId);

        const userIdArray = UserID.map(user => user.user_id);

        const UserNames = await knex('users').select('id as user_id', 'name')
            .whereIn('id', userIdArray);
        return UserNames;
    }catch (e){
        throw new Error('Failed to save user to the database');
    }
}

module.exports.addUserGrouprepo = async (usersId,group_id,id) => {
    try{
        const access = await knex('groups').where('id',group_id).andWhere('adminId',id);
        if(access.length > 0){
            for (let i = 0 ; i < usersId.length ; i++) {
                await knex('userGroups').insert({
                    'user_id' : usersId[i],
                    'group_id' : group_id
                }) ;
            }
            return 'the users has been added' ;
        }else throw new Error('you don\'t have permission') ;
    }catch (e){
        throw new Error(e.message);
    }
}

module.exports.askToJoinRepo = async (userId,groupId) => {
    try{
        const {adminId} = await knex('groups').select('adminId').where('id',groupId).first();
        const notification = await knex('addNotifications').insert({
            'message' : `can The user with the id${userId} to the group with id${groupId}`,
            'userId' : userId,
            'adminId' : adminId,
            'groupId' : groupId
        })
        return notification;
    }catch (e){
        throw new Error(e.message);
    }
}

module.exports.acceptJoinRequestRepo = async (userId , groupId) => {
    try {
        await knex('userGroups').insert({
            'user_id' : userId,
            'group_id' : groupId
        }) ;
        await knex('addNotifications').delete().where('userId' , userId).andWhere('groupId' , groupId) ;
        return 'the request has been accepted' ;
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getNotificationAdd = async (id) => {
    try {
        return await knex('addNotifications').where('adminId' , id);
    } catch (e) {
        throw new Error(e.message);
    }
}