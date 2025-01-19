const bcrypt = require("bcrypt");
const repo = require("../repositories/group.repo");
const jwt = require("jsonwebtoken");
module.exports.createGroupService = async (id , name) => {
    try {
        return await repo.createGroupRepo(id , name);
    } catch (e) {
        throw new Error(e.message);
    }
}


module.exports.getGroupsservice = async () => {
    try {
        return await repo.getGroupRepo();
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getMyGroupsservice = async (id) => {
    try {
        return await repo.getMyGroupRepo(id);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getFileByGroupService = async (groupId, page) => {
    try {
        return await repo.getFileByGroupRepo(groupId, page);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.EditGroupNameService = async (groupId, name) => {
    try {
        if (typeof name !== 'string') {
            throw new Error('Invalid name provided');
        }
        return await repo.EditGroupNameRepo(groupId, name);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.deleteGroupService = async (groupId) => {
    try {
        return await repo.deleteGroupRepo(groupId);
    } catch (e) {
        throw new Error(e.message);
    }
}