const Discord = require("discord.js");
const bot = new Discord.Client();

bot.settings = require("../settings.json");
exports.run = (bot, message, args) => {


    const alreadyopen = new Discord.RichEmbed()
        .setDescription(`You currently have a open introduction channel!`)
        .setColor('#7a0000')


    if (message.guild.channels.find(ApplyChannel => ApplyChannel.name === 'i-' + message.author.id))
        return message.channel.send(alreadyopen);

    message.guild.createChannel(`i-` + message.author.id, {
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
            .setDescription(`✅ We made a introduction form channel for you <#${ApplyChannel.id}>\n||<@${message.author.id}>||`)
            .setColor('#36c753')
        message.delete();
        message.channel.send({ embed: appopened }).then(async message => {
            message.clearReactions();
        })

        const Apply_Welcome = `\nThank you for willing to introduce yourself be **honest** and **serious**, any insulting message can result in a punishment..\n\n**Please click on the reaction from the message to cancel your introduction questions** `

        const WelcomeMSG = new Discord.RichEmbed()
            .setTitle(`Hello, ${message.author.username}`)
            .setDescription(Apply_Welcome)
            .setColor('#a10000')
            .setFooter('E-HUB - Introduction form')

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
                .setColor('#9e1515')
                .setTitle("Loading questions for introduction...")
                .setDescription(`<@${message.author.id}>`)

            ApplyChannel.send(succEmbed1)

            let usernameEmbed = new Discord.RichEmbed()
                .setDescription(`What is your real name?`)
                .setColor('#850d0d')
                .setFooter('> Please answer it seriously..')
            ApplyChannel.send(usernameEmbed);

            let answers = [];

            ApplyChannel.awaitMessages(response => response.content.length > 2, {
                max: 1,
                time: 500000,
                errors: ['time'],
            }).then((collected) => {
                answers.push(collected.map(r => r.content));
                let question2 = new Discord.RichEmbed()
                    .setDescription(`How old are you currently?`)
                    .setColor('#a13333')
                    .setFooter('>Please answer it seriously..')
                ApplyChannel.send(question2);

                ApplyChannel.awaitMessages(response => response.content.length > 0, {
                    max: 1,
                    time: 500000,
                    errors: ['time'],
                }).then((collected) => {
                    answers.push(collected.map(r => r.content));
                    let question2 = new Discord.RichEmbed()
                        .setDescription(`In which country do you live in?`)
                        .setColor('#a14242')
                        .setFooter('>Please answer it seriously..')
                    ApplyChannel.send(question2);

                    ApplyChannel.awaitMessages(response => response.content.length > 2, {
                        max: 1,
                        time: 500000,
                        errors: ['time'],
                    }).then((collected) => {
                        answers.push(collected.map(r => r.content));
                        let question3 = new Discord.RichEmbed()
                            .setDescription(`What's your gender? (Male, Female, Non Binary)`)
                            .setColor('#9c5151')
                            .setFooter('>Please answer it seriously')
                        ApplyChannel.send(question3);

                        ApplyChannel.awaitMessages(response => response.content.length > 2, {
                            max: 1,
                            time: 500000,
                            errors: ['time'],
                        }).then((collected) => {
                            answers.push(collected.map(r => r.content));
                            let question4 = new Discord.RichEmbed()
                                .setDescription(`What are your hobbies/interests?`)
                                .setColor('#c25f5f')
                                .setFooter('>Please answer it seriously')
                            ApplyChannel.send(question4);

                            // NEXT
                            ApplyChannel.awaitMessages(response => response.content.length > 2, {
                                max: 1,
                                time: 500000,
                                errors: ['time'],
                            }).then((collected) => {
                                answers.push(collected.map(r => r.content));

                                let qEmbed = new Discord.RichEmbed()
                                    .setTitle(`Thank you very much for answering all the questions`)
                                    .setDescription(`You can view your end result at <#658786349566001163>`)
                                    .setColor('#d65151')
                                    .setFooter('Successfully filled!')
                                ApplyChannel.send(qEmbed);

                                let logEmbed = new Discord.RichEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL)
                                    .addField(`Name`, `${answers[0]}`, true)
                                    .addField(`Location`, `${answers[2]}`, true)
                                    .addField(`Age`, `${answers[1]}`, true)
                                    .addField(`Gender`, `${answers[3]}`)
                                    .addField(`Hobby/Interests`, `${answers[4]}`)
                                    .setColor('#429496')
                                    .setThumbnail(message.author.displayAvatarURL)

                                let logChannel = message.guild.channels.find(ApplyChannel => ApplyChannel.name === `introductions`);
                                if (!logChannel) return message.channel.send(`:x: Error! Could not find the logs channel **${bot.settings.Apply_Log}**`);

                                logChannel.send({ embed: logEmbed })
                                    .then(collected => {
                                        ApplyChannel.delete(30000);
                                    })



                            })

                        })

                    });

                });

            });





        });


    });




}

exports.help = {
    name: bot.settings.Apply_Command,
}