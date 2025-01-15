const knex = require('../db') ;

class Group {
    constructor(data) {
        this.name = data.name ;
    }

    save() {
        return knex('groups').insert(this) ;
    }
}

module.exports.Group = Group ;