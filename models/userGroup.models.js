const knex = require('../db') ;

class UserGroup {
    constructor(data) {
        this.group_id = data.group_id ;
        this.user_id = data.user_id ;
    }

    save() {
        return knex('userGroups').insert(this) ;
    }
}

module.exports.UserGroup = UserGroup ;