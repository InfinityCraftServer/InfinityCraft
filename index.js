const Discord = require('discord.js');
const botsettings = require('./config.json');
require('dotenv').config()
const VerifyRequest = require('./commands/functions/verify_requests.js')

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

const express = require('express');
const verify_requests = require('./commands/functions/verify_requests.js');
const app = express();
const port = 3000;


app.listen(3000, () => console.log("Webserver booted up"))
app.use(express.static('public'))

app.get("/finishpartner", async function (req, res){
    var requestID = req.param("pr")
    var membercount = req.param("mcs")
    var invite = req.param("i")
    var reason = req.param("r")
    if(await verify_requests.finishRequest(bot, requestID, membercount, invite, reason) == false){
        res.send(`{"success":"false"}`)
    } else {
        res.send(`{"success":"true"}`)
    }
})


app.get("/verifyrequest", async function (req, res) {
    try{
    var partnercode = req.param('id')
    var verified = await VerifyRequest.partner(partnercode)
    if (verified == false) {
        res.send(`{"code":"${partnercode}","valid":"false"}`)
    } else {
        var results = verified.split(".")
        res.send(`{"code":"${partnercode}","valid":"true","ticketID":"${results[0]}","userID":"${results[1]}"}`)
    }}
    catch{
        res.redirect("/partnervoorwaarden")
    }
})


app.get('/partnervoorwaarden', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./Web/partnerpage.html', null, function (error, data) {
        if (error) {
            // res.writeHead(404);
            res.write('File not found!');
        } else {
            var page = data.toString();
            res.write(page)

        }
        res.end();
    })
})

app.get('/partneraanvraag', async function (req, res) {
    var partnercode = req.param('id')
    if (!partnercode) {
        res.redirect("/partnervoorwaarden")
        return
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./Web/partnerrequest.html', null, async function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            try{
            var verified = await VerifyRequest.partner(partnercode)
            console.log(verified)
            var results = verified.split(".")
            console.log(results)

            var page = data.toString();
            page = page.replace(/-discordname-/g, results[1])
            page = page.replace(/-ticketID-/g, results[0])
            page = page.replace(/-requestID-/, partnercode)



            res.write(page)
            } catch{}
        }
        res.end();
    })
})


// register command
fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
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

    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
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
