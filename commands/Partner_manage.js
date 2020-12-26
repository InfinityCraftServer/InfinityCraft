const Discord = require("discord.js")
const botconfig = require("../config.json");
const ms = require('ms');
const checkdevs = require("./functions/check_developer.js")
const sqlite = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) { return; }
    let db = new sqlite.Database(`./partners.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
    if(!args[0,1]){
        message.reply(`${botconfig.prefix}partner [add/remove] (serverid)`)
    }
    
    try {
        user = message.mentions.users.first().id
    } catch {
        user = args[1]
    }
    var partnerRole = message.guild.roles.cache.get("730550915559587852")
    var newPartner = message.guild.members.cache.get(user)
    if(args[0] == "add"){
        db.run(`INSERT OR REPLACE INTO partnerservers VALUES("${user}", "${args[2]}")`)
        newPartner.roles.add(partnerRole)
        message.reply("User toegevoegd als partner")
        
    } 
    if(args[0] == "remove"){
        db.run(`DELETE FROM partnerservers WHERE userID = "${user}"`)
        db.run(`DELETE FROM cooldowns WHERE userID = "${user}"`)
        newPartner.roles.remove(partnerRole)
        message.reply("User verwijderd als partner")
    }
}

module.exports.config = {
    name: "partner",
    description: "Voeg een partner toe of verwijder er een",
    aliases: [],
    permission: "ADMINISTRATOR"
}