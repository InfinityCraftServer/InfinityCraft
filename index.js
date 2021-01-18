const Discord = require('discord.js');
const botsettings = require('./config.json');

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

const express = require('express');
const app = express();
const port = 3000;
app.listen(port, () => console.log(`webserver online!`));


app.get('/*', function (req, res) {
    res.send("Online")
})

// register command
fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("No commands found");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);  
        console.log("command " + botsettings.prefix + pull.config.name + " loaded")
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
            console.log(`new alias loaded for ${botsettings.prefix + pull.config.name} (${botsettings.prefix + alias})`)
        });
    });
});

// register events
fs.readdir("./events/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("No events found");
    }
    jsfile.forEach((f, i) => {
       require(`./events/${f}`);
       console.log(`Event ${f} loaded`)
    });
});


bot.on("message", async message => {
    if (message.author.bot || message.channel.type === "dm") return;

    let prefix = botsettings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) {
        if (commandfile.config.permission == "DEVELOPER" && await checkdevs.check(message.author.id) == false) {
            message.reply("Only bot developers can access this command")
            return;
        } else {
            commandfile.run(bot, message, args)
        }

    } else {
        message.reply("This command is not found!")
    }
})
bot.login(process.env.token);
