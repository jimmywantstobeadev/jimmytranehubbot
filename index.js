const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();

bot.commands = new Discord.Collection();
bot.settings = require("./settings.json");

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) return console.log(`${bot.settings.botname} No commands found. Try to Re-download the resource`);

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`[${bot.settings.botname}] > Command Loaded > ${f}`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on("ready", async() => {
    bot.user.setActivity(bot.settings.BotStatus, { type: "WATCHING" });
    console.log(`\u001b[31m`, `------------[ E-HUB ]------------`)
    console.log(`\u001b[32m`, `E-HUB is now online`)
    console.log(`\u001b[31m`, `------------[ E-HUB ]------------`)

    console.log(`\u001b[31m`, `\n\n------------[ E-HUB Stats ]------------`)
    console.log(`\u001b[32m`, `Bot Username: ${bot.user.username}\nInvite Link: https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`)
    console.log(`\u001b[31m`, `------------[ E-HUB Stats ]------------`)

});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content.indexOf(bot.settings.prefix) !== 0) return;

    let messageArray = message.content.split(" ");
    const args = message.content.slice(bot.settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = bot.commands.get(command);
    if (!cmd) return;
    cmd.run(bot, message, args);
});

bot.login(process.env.BOT_TOKEN);
