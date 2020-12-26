const Discord = require("discord.js")
const botconfig = require("../config.json");
const ms = require('ms');
const checkdevs = require("./functions/check_developer.js")
const sqlite = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    if (message.channel.parentID != "790809845019836437") { message.reply("Dit kan enkel gedaan worden in tickets") }
    var member = message.mentions.users.first().id
    try {
       
        message.channel.updateOverwrite(member, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            CREATE_INSTANT_INVITE: false,
            READ_MESSAGE_HISTORY: false,
            ATTACH_FILES: false,
            CONNECT: false,
            ADD_REACTIONS: false

        })
        var embed = new Discord.MessageEmbed()
            .setAuthor("Success")
            .setColor("GREEN")
            .addField("User verwijderd", `<@${member}>`)
            .setFooter("InfinityCraft copyright 2020")
            .setTimestamp()
        message.channel.send(embed)
    } catch {

        var embed = new Discord.MessageEmbed()
            .setAuthor("Failled")
            .setColor("Red")
            .addField("Fout", `User niet toe kunnen verwijderen`)
            .setFooter("InfinityCraft copyright 2020")
            .setTimestamp()
        message.channel.send(embed)
    }

}

module.exports.config = {
    name: "removeuser",
    description: "Verwijder een user aan uit het ticket",
    aliases: ['remove'],
    permission: "PLAYER"
}