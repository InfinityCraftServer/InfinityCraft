const Discord = require("discord.js")
const botsettings = require('../config.json');
const bot = new Discord.Client();
const sqlite = require('sqlite3').verbose();
require('dotenv').config()

bot.on('ready', async () => {
  console.log("Bot successvol opgestart")
  let db = new sqlite.Database('./reactionroles.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
  db.configure("busyTimeout", 60000)
  db.run(`CREATE TABLE IF NOT EXISTS data (messageID TEXT NOT NULL, emoji TEXT NOT NULL, roleID TEXT NOT NULL)`)
  db.close()
  let db2 = new sqlite.Database(`./ticketGroepen.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
  db2.configure("busyTimeout", 60000)
  db2.run(`CREATE TABLE IF NOT EXISTS data (messageID TEXT NOT NULL, category TEXT NOT NULL)`)
  db2.close()
  let db3 = new sqlite.Database(`./partners.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
  db3.configure("busyTimeout", 60000)
  db3.run(`CREATE TABLE IF NOT EXISTS cooldowns (userID TEXT NOT NULL UNIQUE, cooldown TEXT NOT NULL)`)
  db3.run(`CREATE TABLE IF NOT EXISTS partnerservers (userID TEXT NOT NULL UNIQUE, serverID TEXT NOT NULL)`)
  db3.run(`CREATE TABLE IF NOT EXISTS requests (channelID TEXT NOT NULL UNIQUE, requestID TEXT NOT NULL UNIQUE, userID TEXT NOT NULL UNIQUE)`)
  db3.close()
})

bot.login(process.env.token);   