const Discord = require("discord.js")
const botsettings = require('../config.json');
require('dotenv').config()
var crypto = require("crypto");

const sqlite = require('sqlite3').verbose();

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.on('messageReactionAdd', async (reaction, user) => {
    let db = new sqlite.Database(`./ticketGroepen.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
    let db2 = new sqlite.Database(`./partners.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
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
    // if(!reaction.message.channel.id == botsettings.ticketchannel || reaction.emoji.id != "790818246164217876") {return;}

    var query = `SELECT category AS value FROM data WHERE messageID = ${reaction.message.id}`
    db.get(query, (err, row) => {
        if (err) {
            console.log(err)
        }
        if (row == undefined) {
            return;
        }
        var subject = row.value
        subjectname = subject.replace(" ", "_")
        reaction.users.remove(user.id);
        reaction.message.guild.channels.create(subjectname + "-" + user.username, { type: 'text' }).then(
            (createdChannel) => {
                createdChannel.setParent("790809845019836437").then(
                    (settedParent) => {
                        settedParent.updateOverwrite(user.id, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            CREATE_INSTANT_INVITE: false,
                            READ_MESSAGE_HISTORY: true,
                            ATTACH_FILES: true,
                            CONNECT: true,
                            ADD_REACTIONS: false
                        })
                        var welkomstembed = new Discord.MessageEmbed()
                            .setAuthor("Welkom " + user.username)
                            .setColor("GREY")
                            .addFields(
                                { name: 'Support ticket', value: `Dit ticket is aangemaakt met als reden: ***${subject}*** \nU word zo spoedig mogelijk geholpen door een van onze aanwezige staffleden` }
                            )
                        if (subject.includes("Partnerships")) {
                            var requestID = crypto.randomBytes(20).toString('hex');
                            var channelID = createdChannel.id
                            var userID = user.id
                            

                            db2.run(`INSERT OR REPLACE INTO requests VALUES("${channelID}", "${requestID}", "${userID}")`)
                            db2.close()

                            welkomstembed.addFields(
                                { name: 'PartnerCode', value: `${requestID}`},
                                {name: "Link:", value: "https://InfinityCraft.valiblackdragon.repl.co/partnervoorwaarden"}
                                )
                        }
                        welkomstembed
                            .setFooter("InfinityCraft copyright 2020")
                        createdChannel.send(welkomstembed).then(msg => {
                            msg.pin()
                            msg.react('790974361473384479')
                        }
                        )
                        createdChannel.send(`<@${user.id}>`).then(msg => {
                            msg.channel.bulkDelete(2)
                            msg.channel.send("Om je partnership aan te vragen, kopieër je de partnercode en volg je de instructies te vinden op de link")
                        })



                    }
                )

            }).catch(err => {
                console.log(err)
            })

    })
    db.close()

});


bot.login(process.env.token);