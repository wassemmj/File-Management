const service = require('../services/group.service') ;
const joi = require('joi') ;

module.exports.createGroup = async (req , res) => {
    try {
        const schema = joi.object({
            name : joi.string().required() ,
        }) ;
        const { error } = schema.validate(req.body) ;
        if (error) return res.status(404).send({ message : error.details[0].message})
        const group = await service.createGroupService(req.user.id , req.body.name) ;

        res.status(200).send({'message' : `A group ${group} created Successfully by ${req.user.id}`}) ;
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while creating the user'}) ;
    }
}

module.exports.getGroups = async (req , res)=>{
    try{
        const groups = await service.getGroupsservice();
        res.status(200).send({'groups' : groups}) ;
    }catch(e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while Getting the groups'}) ;
    }
}

module.exports.getMyGroups = async (req , res)=>{
    try{
        const groups = await service.getMyGroupsservice(req.user.id);
        res.status(200).send({'groups' : groups}) ;
    }catch(e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while Getting the groups'}) ;
    }
}

module.exports.getFileByGroup = async (req , res)=>{
    try{
        const groupId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const files = await service.getFileByGroupService(groupId, page);
        res.status(200).send({'files' : files}) ;
    }catch(e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while Getting the groups'}) ;
    }
}

module.exports.EditGroupName = async (req , res)=>{
    try{
        const groupId = req.params.id;
        const { name } = req.body;
        const files = await service.EditGroupNameService(groupId, name);
        res.status(200).send({ message: 'group name updated successfully' }) ;
    }catch(e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while Getting the groups'}) ;
    }
}