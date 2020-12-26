const Discord = require("discord.js")
const botconfig = require("../config.json");
const ms = require('ms');
const checkdevs = require("./functions/check_developer.js")
const sqlite = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")){return;}

    let db = new sqlite.Database('./reactionroles.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
    db.configure("busyTimeout", 60000)
    db.run(`INSERT OR REPLACE INTO data VALUES(${args[0]}, "${args[1]}", "${args[3]}")`)
    db.close();

    message.channel.messages.fetch(args[0]).then(msg => { msg.react(args[1]) })

}

module.exports.config = {
    name: "addreactionrole",
    description: "Voeg een reaction role toe",
    aliases: ['rradd'],
    permission: "ADMINISTRATOR"
}