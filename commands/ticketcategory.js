const Discord = require("discord.js")
const botconfig = require("../config.json");
const ms = require('ms');
const checkdevs = require("./functions/check_developer.js")
const sqlite = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")){return;}
    let db = new sqlite.Database(`./ticketGroepen.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
    let reason = args.join(" ")
    if (!reason) {
        message.channel.send("Geef een geldige category naam op!")
        return;
    }
    var ticketembed = new Discord.MessageEmbed()
    .setAuthor(reason)
    .addFields(
        {name: "Ticket aanmaken", value: `Maakt een ticket aan met de reden ***${reason}***`}
    )
    .setColor("GREEN")
    .setFooter("InfinityCraft copyright 2020")
    message.channel.send(ticketembed).then((message) => {
        message.react('790818246164217876')
        db.run(`INSERT OR REPLACE INTO data VALUES("${message.id}", "${reason}")`)
        db.close()
    })
    
}

module.exports.config = {
    name: "addtickets",
    description: "voeg een ticket category toe",
    aliases: ['ticketcategory'],
    permission: "ADMINISTRATOR"
}