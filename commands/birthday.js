const Discord = require("discord.js");
const bot = new Discord.Client();

bot.settings = require("../settings.json");
exports.run = (bot, message, args) => {


    const alreadyopen = new Discord.RichEmbed()
        .setDescription(`You currently have a open birthday channel!`)
        .setColor('#7a0000')


    if (message.guild.channels.find(ApplyChannel => ApplyChannel.name === 'b-' + message.author.id))
        return message.channel.send(alreadyopen);

    message.guild.createChannel(`b-` + message.author.id, {
        type: 'text',
    }).then(ApplyChannel => {
        let everyone = message.guild.roles.find(everyoneRole => everyoneRole.name === `@everyone`)

        ApplyChannel.overwritePermissions(everyone, { SEND_MESSAGES: false, READ_MESSAGES: false });
        ApplyChannel.overwritePermissions(message.author, { SEND_MESSAGES: true, READ_MESSAGES: true });

        let category = message.guild.channels.find(c => c.name === '▬▬▬▬▬ Tickets ▬▬▬▬▬▬');
        if (category) {
            ApplyChannel.setParent(category.id);
        }


        const appopened = new Discord.RichEmbed()
            .setDescription(`✅ We made a birthday form channel for you <#${ApplyChannel.id}>\n||<@${message.author.id}>||`)
            .setColor('#36c753')
        message.delete();
        message.channel.send({ embed: appopened }).then(async message => {
            message.clearReactions();
        })

        const Apply_Welcome = `\nThank you for willing to set your birthday, please answer it **honest** and **serious**!\n\n**Please click on the reaction to cancel your birthday questions**`

        const WelcomeMSG = new Discord.RichEmbed()
            .setTitle(`Hello, ${message.author.username}`)
            .setDescription(Apply_Welcome)
            .setColor('#9b34c7')
            .setFooter('E-HUB - Birthday form')

        ApplyChannel.send(WelcomeMSG).then(async function(msg) {
            msg.react('⛔');

            const filter = (reaction, user) => {
                return ['⛔'].includes(reaction.emoji.name) && user.id !== msg.author.id;
            };

            msg.awaitReactions(filter, { max: 1, time: 6000000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '⛔') {
                        ApplyChannel.delete();
                    }
                });

            const succEmbed1 = new Discord.RichEmbed()
                .setColor('#ffa1e9')
                .setTitle("Loading questions to set your birthday...")
                .setDescription(`<@${message.author.id}>`)

            ApplyChannel.send(succEmbed1)

            let usernameEmbed = new Discord.RichEmbed()
                .setDescription(`What's the **day** of your birthday?`)
                .setColor('#ffa1e9')
                .setFooter('> Please answer it seriously..')
            ApplyChannel.send(usernameEmbed);

            let answers = [];

            ApplyChannel.awaitMessages(response => response.content.length > 0, {
                max: 1,
                time: 500000,
                errors: ['time'],
            }).then((collected) => {
                answers.push(collected.map(r => r.content));
                let question2 = new Discord.RichEmbed()
                    .setDescription(`What's the **month** of your birthday?`)
                    .setColor('#ffa1e9')
                    .setFooter('> Please answer it seriously..')
                ApplyChannel.send(question2);

                ApplyChannel.awaitMessages(response => response.content.length > 1, {
                    max: 1,
                    time: 500000,
                    errors: ['time'],
                }).then((collected) => {
                    answers.push(collected.map(r => r.content));
                    let question2 = new Discord.RichEmbed()
                        .setDescription(`Which **year** were u born?`)
                        .setColor('#ffa1e9')
                        .setFooter('> Please answer it seriously..')
                    ApplyChannel.send(question2);

                    ApplyChannel.awaitMessages(response => response.content.length > 1, {
                        max: 1,
                        time: 500000,
                        errors: ['time'],
                    }).then((collected) => {
                        answers.push(collected.map(r => r.content));

                        let qEmbed = new Discord.RichEmbed()
                            .setTitle(`Thank you very much for answering all the questions`)
                            .setDescription(`You can view your birthday at <#658490896450584579>`)
                            .setColor('#ad3699')
                            .setFooter('Successfully set your birthday!')
                        ApplyChannel.send(qEmbed);

                        let logEmbed = new Discord.RichEmbed()
                            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL)
                            .addField(`Day`, `${answers[0]}`, true)
                            .addField(`Month`, `${answers[1]}`, true)
                            .addField(`Year`, `${answers[2]}`, true)
                            .setColor('#dd8cff')
                            .setThumbnail(message.author.displayAvatarURL)

                        let logChannel = message.guild.channels.find(ApplyChannel => ApplyChannel.name === `birthdays`);
                        if (!logChannel) return message.channel.send(`:x: Error! Could not find the logs channel **${bot.settings.Apply_Log}**`);

                        logChannel.send({ embed: logEmbed })
                            .then(collected => {
                                ApplyChannel.delete(30000);
                            })



                    })




                });

            });






        });


    });




}

exports.help = {
    name: bot.settings.Birthday_Command,
}