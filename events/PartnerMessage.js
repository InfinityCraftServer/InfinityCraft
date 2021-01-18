const Discord = require("discord.js")
const botsettings = require('../config.json');
const fetch = require("node-fetch");
require('dotenv').config()

const sqlite = require('sqlite3').verbose();

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.on('message', async message => {
    if ((message.author.bot || message.channel.id != "730533553821057106")) { return; }
    try{
    if (await check_server(message) == false) {
        message.delete()

        var workembed = new Discord.MessageEmbed()
            .setTitle(message.author.username)
            .setColor("RED")
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter("InfinityCraft copyright 2020")
            .addFields(
                { name: "Server niet gevonden", value: `Je mag alleen reclame maken voor de opgegeven partner server. Als je denkt dat dit een fout was, meld dit dan bij de owner! (Indien dit wel de goede server was, is de invite mogelijk ongeldig)` }
            )
        message.guild.channels.cache.get("756519548831662120").send(workembed)
        message.guild.channels.cache.get("756519548831662120").send(`<@${message.author.id}>`).then(msg => {
            msg.delete()
            return;
        })
        return;
    }
    } catch {}

    var cooldowntime = "1440.0"
    var cooldowns = await check_cooldown(message.author.id, cooldowntime)
    console.log(cooldowns)
    if (cooldowns != "0") {
        message.delete();
        var wacht = cooldowns.toString().split(".")
        var cooldown_min = wacht[0].toString()
        var cooldown_sec = wacht[1].toString()
        var workembed = new Discord.MessageEmbed()
            .setTitle(message.author.username)
            .setColor("RED")
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter("InfinityCraft copyright 2020")
            .addFields(
                { name: "Cooldown", value: `Je hebt nog **${cooldown_min}** minuten en **${cooldown_sec}** seconden cooldown op het versturen van een reclamebericht!` }
            )
        message.guild.channels.cache.get("756519548831662120").send(workembed)
        message.guild.channels.cache.get("756519548831662120").send(`<@${message.author.id}>`).then(msg => {
            msg.delete()
        })
    } else {
        let db = new sqlite.Database('./partners.db', sqlite.OPEN_READWRITE)
        db.run(`INSERT OR REPLACE INTO cooldowns VALUES("${message.author.id}", "${new Date()}")`)
        db.close()
    }
});

async function getServerId(inviteCode) {
    let result = await fetch(`https://valiblackdragon-discord.glitch.me/?code=${inviteCode}`);
    let json = await result.json();
    return json
}
async function check_server(message) {
    return new Promise(async (res) => {
        var linkBase = "https://discord.gg/"
        var messageArray = message.content.split(" ");
        for (let i = 0; i < messageArray.length; i++) {
            var Possibleinvite = messageArray[i];
            console.log(Possibleinvite)
            if (Possibleinvite.includes("discord.gg")) {
              console.log(Possibleinvite + "Trigger")
                inviteCode = Possibleinvite.replace(linkBase, "")
                let serverID = await getServerId(inviteCode)
                let query = `SELECT serverID AS value FROM partnerservers WHERE userID = ${message.author.id}`;
                let db = new sqlite.Database('./partners.db', sqlite.OPEN_READWRITE)
                db.get(query, (err, row) => {
                    if (err) {
                        console.log(err)
                        res(false)
                    }
                    if (row == undefined) {
                        res(false);
                        return;
                    } else {
                      try{
                        if(serverID.guild.id != row.value){
                          console.log(serverID.guild.id + `ServerID` +row.value + `row.value`)
                            res(false)
                        } else {
                            res(true)
                        }
                      } catch{
                        res(true)
                      }
                    }

                })
                db.close();
            }
        }
    })
}

function check_cooldown(userid, cooldowntime) {
    return new Promise((res) => {
        let query = `SELECT cooldown AS value FROM cooldowns WHERE userid = ${userid}`;
        let db = new sqlite.Database('./partners.db', sqlite.OPEN_READWRITE)
        db.get(query, (err, row) => {
            if (err) {
                console.log(err)
            }
            if (row == undefined) {
                console.log("UND")
                res("0");
            } else {
                var wacht = cooldowntime.toString().split(".")
                var cooldown_min = wacht[0]
                var cooldown_sec = wacht[1]

                var datetime = new Date(row.value).getTime();
                var now = new Date().getTime();

                var milisec_diff = now - datetime;

                var minutes = Math.floor(milisec_diff / 1000 / 60);
                var seconds = Math.floor((milisec_diff / 1000) % 60);

                if (minutes > cooldown_min || (minutes == cooldown_min && seconds > cooldown_sec)) {
                    res("0")
                } else {
                    min = cooldown_min - minutes
                    sec = cooldown_sec - seconds
                    if (sec < 0) {
                        sec = 60 + sec
                        min = Math.max(min - 1, 0)
                    }

                    res(`${min}.${sec}`)
                }
            }

        })
        db.close();
    });
}


bot.login(process.env.token);