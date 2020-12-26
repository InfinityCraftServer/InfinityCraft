const Discord = require("discord.js")
const botconfig = require("../config.json");
const ms = require('ms');
const checkdevs = require("./functions/check_developer.js")


module.exports.run = async (bot, message, args) => {
    if (await checkdevs.check(message.author.id) != true){return;}
    let totalSeconds = (bot.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} dagen, ${hours} uur, ${minutes} minuten en ${seconds} seconden`;

    message.channel.send("Pinging...").then(m =>{
        var ping = m.createdTimestamp - message.createdTimestamp;

        var pingembed = new Discord.MessageEmbed()
        .setTitle(bot.user.username)
        .setColor("02CD4A")
        .setThumbnail(bot.user.displayAvatarURL())
        .addFields(
            { name: 'Latency', value: `${ping}ms` },
            { name: 'API Latency', value: `${Math.round(bot.ws.ping)}ms` },
            { name: 'Uptime', value: `${uptime}`}
        )
        .setTimestamp()
        .setFooter("InfinityCraft copyright 2020")
        m.delete()
        m.channel.send(pingembed)
    })
}

module.exports.config = {
    name: "botinfo",
    description: "Krijg benodigde info over de bot",
    aliases: ['ping', 'uptime','online', 'latency'],
    permission: "DEVELOPER"
}