const Discord = require("discord.js")
const botconfig = require("../config.json");
const ms = require('ms');
const checkdevs = require("./functions/check_developer.js")
const sqlite = require('sqlite3').verbose();

module.exports.run = async (bot, message, args) => {
    if (message.channel.parentID != "790809845019836437") { message.reply("Dit kan enkel gedaan worden in tickets") }
    try {
        message.channel.updateOverwrite(args[0], {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            CREATE_INSTANT_INVITE: false,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
            CONNECT: true,
            ADD_REACTIONS: false

        })
        var embed = new Discord.MessageEmbed()
            .setAuthor("Success")
            .setColor("GREEN")
            .addField("User toegevoegd", `<@${args[0]}>`)
            .setFooter("InfinityCraft copyright 2020")
            .setTimestamp()
        message.channel.send(embed)
        message.channel.send(`<@${args[0]}>`).then(msg => {
            msg.delete();
        })
    } catch {

        var embed = new Discord.MessageEmbed()
            .setAuthor("Failled")
            .setColor("Red")
            .addField("Fout", `User niet toe kunnen voegen`)
            .setFooter("InfinityCraft copyright 2020")
            .setTimestamp()
        message.channel.send(embed)
    }

}

module.exports.config = {
    name: "adduser",
    description: "Voeg een user toe aan een ticket",
    aliases: ['add'],
    permission: "PLAYER"
}