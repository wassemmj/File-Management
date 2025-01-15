const _ = require('lodash') ;
const joi = require('joi') ;
const services = require('../services/user.service')
const service = require("../services/group.service");
const Joi = require("joi");
const knex = require("../db");
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require("../utils/tokens");
const bcrypt = require("bcrypt");

module.exports.createUser = async (req , res) => {
    const schema = joi.object({
        name : joi.string().required() ,
        email : joi.string().email().required() ,
        password : joi.string().min(8).required() ,
    }) ;

    const newUser = req.body ;
    const { error } = schema.validate(newUser) ;
    if (error) return res.status(404).send({'message' : error.details[0].message}) ;

    try {
        const token = await services.createUserService(newUser) ;
        res.status(200).send({'user' : _.omit(newUser, 'password') , 'token' : token}) ;
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while creating the user'}) ;
    }
}

module.exports.login = async (req , res) => {
    const schema = joi.object({
        email : joi.string().email().required() ,
        password : joi.string().min(8).required() ,
    }) ;

    const newUser = req.body ;
    const { error } = schema.validate(newUser) ;
    if (error) return res.status(404).send({'message' : error.details[0].message}) ;

    try {
        const query = await services.loginService(newUser) ;
        res.status(200).send(query) ;
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while logging in'}) ;
    }
}

module.exports.getUsers = async (req,res) =>{
    try{
        const users = await services.getUserservice(req.user.id) ;
        res.status(200).send({'users':users})
    }catch (e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while logging in'}) ;
    }
}
module.exports.getUsersInGroup = async (req,res) =>{
    try{
        const groupId = req.params.groupId;
        const users = await services.getUsersInGroupservice(groupId) ;
        res.status(200).send({'users':users})
    }catch (e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while logging in'}) ;
    }
}

module.exports.addUserGroup = async (req , res) => {
    try {
        const schema = joi.object({
            usersId: joi.array().items(Joi.number()),
        }) ;
        const { error } = schema.validate(req.body) ;
        if (error) throw new Error(error.details[0].message)
        // const user_id = req.params.user_id;
        const group_id = req.params.group_id;
        await services.addUserGroupservice(req.body.usersId,group_id,req.user.id) ;

        res.status(200).send({'message':`the user add successfully`})
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : e.message}) ;
    }
}

module.exports.askToJoin = async (req , res) => {
    try {
        const groupId = req.params.id ;
        const userId = req.user.id ;
        await services.askToJoinService(userId,groupId) ;
        return res.status(200).send('Your join request has been sened successfully');
    } catch (e) {
        res.status(404).send({ message : e.message })
    }
}

module.exports.acceptJoinRequest = async (req , res) => {
    try {
        const userId = req.params.id ;
        const groupId = req.params.groupId ;
        await services.acceptJoinRequestService(userId,groupId) ;
        return res.status(200).send('Your join request has been accepted');
    } catch (e) {
        res.status(404).send({ message : e.message })
    }
}

module.exports.getNotificationAdd = async (req , res) => {
    try {
        const userId = req.user.id ;
        const not = await services.getNotification(userId) ;
        return res.status(200).send({notification : not});
    } catch (e) {
        res.status(404).send({ message : e.message })
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        const payload = jwt.verify(refreshToken, 'MySecureKeyRef');

        const storedToken = await knex("refresh_tokens")
            .where({ user_id: payload.id });

        if (storedToken.length === 0) {
            return res.status(403).json({ message: "Refresh token not found" });
        }
        console.log(refreshToken);
        console.log("--------------------------")
        console.log(storedToken[storedToken.length - 1].refresh_token);
        console.log("--------------------------")
        console.log(refreshToken === storedToken[storedToken.length - 1].refresh_token);
        // Validate the refresh token by matching it with the hashed version
        const isTokenValid = refreshToken === storedToken[storedToken.length - 1].refresh_token;

        if (!isTokenValid) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate a new pair of tokens
        const user = { id: payload.id };
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Hash and replace the old refresh token in the database
        const hashedNewRefreshToken = bcrypt.hashSync(newRefreshToken, 10);

        await knex("refresh_tokens")
            .where({ user_id: payload.id })
            .update({ refresh_token: newRefreshToken });

        // Send the new tokens
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};