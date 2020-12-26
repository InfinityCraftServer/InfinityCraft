const Discord = require("discord.js")
const botsettings = require('../config.json');

const sqlite = require('sqlite3').verbose();

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.on('messageReactionAdd', async (reaction, user) => {
    var bot = user.bot
    if (bot == true) { return }

    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    // Now the message has been cached and is fully available
    let db = new sqlite.Database('./reactionroles.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
    let query = `SELECT roleID AS value FROM data WHERE messageID = ${reaction.message.id} AND emoji = "${reaction.emoji}"`;
    db.get(query, (err, row) => {
        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            console.log("Undefined")
        } else {
            let guildMember = reaction.message.guild.members.cache.get(user.id);
            let role = reaction.message.guild.roles.cache.get(row.value);
            guildMember.roles.add(role);
        }
    })

});
bot.on('messageReactionRemove', async (reaction, user) => {
    var bot = user.bot
    if (bot == true) { return }

    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    // Now the message has been cached and is fully available
    let db = new sqlite.Database('./reactionroles.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
    let query = `SELECT roleID AS value FROM data WHERE messageID = ${reaction.message.id} AND emoji = "${reaction.emoji}"`;
    db.get(query, (err, row) => {
        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            console.log("Undefined")
        } else {
            let guildMember = reaction.message.guild.members.cache.get(user.id);
            let role = reaction.message.guild.roles.cache.get(row.value);
            guildMember.roles.remove(role);
        }
    })

});

bot.login(process.env.token);