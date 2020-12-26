const Discord = require("discord.js")
const botsettings = require('../config.json');

const sqlite = require('sqlite3').verbose();

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.on('messageReactionAdd', async (reaction, user) => {
    let isbot = user.bot
    if (isbot == true) { return }

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
    if(reaction.message.channel.parentID != "790809845019836437") {
        return;
    }

    reaction.users.remove(user.id)
    if(reaction.emoji.id == "790974361473384479"){
        reaction.message.react('790976766549950504')
        reaction.message.react('790977383460765736')
    }
    if(reaction.emoji.id == "790977383460765736"){
        reaction.message.reactions.cache.get('790976766549950504').remove()
        reaction.message.reactions.cache.get('790977383460765736').remove()
    }
    if(reaction.emoji.id == "790976766549950504"){
        reaction.message.reactions.cache.get('790976766549950504').remove()
        reaction.message.reactions.cache.get('790977383460765736').remove()
        reaction.message.channel.setParent('790975056259710976')
        reaction.message.channel.lockPermissions()
    }

});


bot.login(process.env.token);