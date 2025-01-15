const knex = require('../db') ;

class User {
    constructor(data) {
        this.name = data.name ;
        this.email = data.email ;
        this.password = data.password;
    }

    async save() {
        return await knex('users').insert(this) ;
    }
}

module.exports = User ;