const Discord = require("discord.js")
const sqlite = require('sqlite3').verbose();
module.exports = {
    partner: function (id) {
        return new Promise((res) => {
            try {
                let db = new sqlite.Database('./partners.db', sqlite.OPEN_READWRITE || sqlite.OPEN_CREATE)
                let query = `SELECT * FROM requests WHERE requestID = "${id}"`;
                db.get(query, (err, row) => {
                    if (err) {
                        console.log(err)
                        res(false)
                    }
                    if (row == undefined) {
                        res(false);
                        return;
                    } else {
                        res(row.channelID + "." + row.userID)
                    }

                })
                db.close();

            }
            catch {
                res(false)
            }
        })

    },
    finishRequest: async function (bot, requestID, membercount, invite, reason) {
        return new Promise((res) => {
            try {
                let db = new sqlite.Database('./partners.db', sqlite.OPEN_READWRITE || sqlite.OPEN_CREATE)
                let query = `SELECT * FROM requests WHERE requestID = "${requestID}"`;

                reason = reason.replace(/!=!/g, ' ')

                db.get(query, (err, row) => {
                    if (err) {
                        console.log(err)
                        res(false)
                    }
                    if (row == undefined) {
                        res(false)
                        return;
                    } else {
                        try {
                            var PartnerEmbed = new Discord.MessageEmbed()
                                .setColor("BLUE")
                                .setTitle("Partner Request")
                                .addFields(
                                    { name: `Aanvrager`, value: `<@${row.userID}>` },
                                    { name: "Membercount", value: membercount },
                                    { name: "Invite link", value: `https://discord.gg/${invite}` },
                                    { name: "Reden voor partnership", value: reason }
                                )
                                .setTimestamp()

                            var server = bot.guilds.cache.get("651116660849246214");
                            server.channels.cache.get(row.channelID).send(PartnerEmbed)
                            server.channels.cache.get(row.channelID).send(`<@${row.userID}> We hebben je request ontvangen en gaan ermee aan de slag!`)
                            db.run(`DELETE FROM requests WHERE requestID = "${requestID}"`)
                        } catch {
                            res(false)
                        }
                    }
                })

                res(true)
            }
            catch {
                res(false)
            }
        })
    }

}