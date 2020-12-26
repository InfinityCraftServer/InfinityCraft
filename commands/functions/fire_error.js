const Discord = require("discord.js")
module.exports = {
    fire: function (message, Reden) {
        var embed = new Discord.MessageEmbed()
        .setTitle(message.author.username)
        .setColor("RED")
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: 'ERROR', value: Reden}
        )
        .setTimestamp()
        .setFooter("DonZ2H Community Bot")
    message.channel.send(embed)

    }

}