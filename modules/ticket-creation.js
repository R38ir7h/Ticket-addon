const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const Discord = require("discord.js");
const Data = require(`${process.cwd()}/models/ticket-user`);
const Data2 = require(`${process.cwd()}/models/ticket-guild`);

module.exports = async (client) => {
    const description = {
        name: "Ticket System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("interactionCreate", async (interaction) => {
        try {

            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            if (!interaction.isButton()) return;
            if (!["general-help", "bug-report", "order-bot", "staff-apply", "partner-apply", "source-code"].includes(interaction.customId)) return;

            const data2 = await Data2.findOne({
                guildID: interaction.guildId
            })
            if (!data2) {
                new Data2({
                    guildID: interaction.guild.id,
                    index: 0
                }).save()
            }
            let a = data2.index;
            let b = ++a;

            switch (interaction.customId) {
                case "general-help":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: config.ticket_category.generalHelp,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: config.ticket_extra.ticket_supporter_role,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            parentID: config.ticket_category.generalHelp,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const GeneralHelpEmbed = new MessageEmbed()
                            .setTitle('__**Билет открыт!**__')
                            .setDescription(`Привет <@${interaction.user.id}>,\n Персонал будет здесь как можно скорее, а пока сообщите нам о своей проблеме!`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Обработать')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Заблокировать')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Закрыть')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                             content: `Добро пожаловать <@${interaction.user.id}>,Wait For <@&954245147040817253>`,
                            embeds: [GeneralHelpEmbed],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        interaction.reply({
                            content: `Билет создан: ${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
                case "bug-report":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: config.ticket_category.bugReport,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: config.ticket_extra.ticket_supporter_role,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            parentID: config.ticket_category.bugReport,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const BugReportEmbed = new MessageEmbed()
                            .setTitle('__**Билет открыт! **__')
                            .setDescription(`Здраствуйте <@${interaction.user.id}>,\n
Персонал будет здесь как можно скорее, а пока расскажите нам об ошибке, с которой вы столкнулись.`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Забрать')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Заблокировать')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Закрыть')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                             content: `Здраствуйте <@${interaction.user.id}>, ожидайте <@&954245147040817253>, <@&954383804003393636>`,
                            embeds: [BugReportEmbed],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        interaction.reply({
                            content: `Ticket has been Created: ${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
                case "order-bot":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: config.ticket_category.orderBot,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: config.ticket_extra.ticket_supporter_role,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            parentID: config.ticket_category.orderBot,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const OrderedEmbed = new MessageEmbed()
                            .setTitle('__**Билет открыт!**__')
                            .setDescription(`Привет <@${interaction.user.id}>,\nПерсонал будет здесь как можно скорее, пока вы можете заполнить информацию, указанную ниже!`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const OrderedEmbed2 = new MessageEmbed()
                            .setTitle(`✅ __**ПРЕДСТАВЬТЕ ИНФОРМАЦИЮ, ПЕРЕЧИСЛЕННУЮ НИЖЕ**__ ✅`)
                            .setDescription(`> **Дату и время.\n> Не обрезанный, не отредактированный развернутый скриншот со всей историей переписки.\n> Ваш никнейм в игре (скопирован с игры).\n> Никнейм нарушителся (скопирован с игры).**`)
                            .setColor(ee.color)

                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Забрать')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Заблокировать')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Закрыть')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                            content: `Здраствуйте <@${interaction.user.id}>,ожидайте  <@&954245147040817253>, <@&954383355145748530>`,
                            embeds: [OrderedEmbed, OrderedEmbed2],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        interaction.reply({
                            content: `Ticket has been Created: ${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
                case "staff-apply":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: config.ticket_category.staffApply,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: config.ticket_extra.ticket_supporter_role,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            parentID: config.ticket_category.staffApply,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const staffApplyEmbed = new MessageEmbed()
                            .setTitle('__**Билет открыт!**__')
                            .setDescription(`Привет <@${interaction.user.id}>,\nПерсонал будет здесь как можно скорее.`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const staffApplyFormEmbed = new MessageEmbed()
                            .setTitle(`📜 Форма заявки персонала 📜`)
                            .setColor(ee.color)
                            .setDescription(`📁 Спасибо за открытие приложения | Расскажите нам что-нибудь о себе!
${interaction.user}, пожалуйста, сообщите нам некоторую информацию!
                            
Вопросы, на которые вам необходимо ответить:                           
**> 1). Сколько вам лет и как вас зовут?
> 2). Откуда вы / какой ваш часовой пояс?
> 3). Как часто вы находитесь в сети интернет?
> 4). сколько времени вы можете провести в игровом онлайне?
> 5). Есть ли у вас опыт в поддержке, если да, то какой и сколько?
> 6). Никнейм, класс, уровень Вашего основного персонажа в игре.
> 7). Раскажите о себе, почему вы видите себя на этой должности.**
                            
                            
**ПРИМЕЧАНИЕ:**
Цель сотрудника заключается в том, чтобы играть на боевом сервере и выполнять роль модератора игрового чата в рамках правил игры, а также предоставлять помощь игрокам в игровых вопросах.
Оставляйте Ваши заявки, количество сотрудников ограничено.`)


                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Забрать')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Заблокировать')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Закрыть')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                             content: `Здраствуйте <@${interaction.user.id}>, ожидайте <@&954245147040817253>, <@&944151445828145152>`,
                            embeds: [staffApplyEmbed, staffApplyFormEmbed],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        interaction.reply({
                            content: `Билет создан: ${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
                case "partner-apply":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: config.ticket_category.partnerApply,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: config.ticket_extra.ticket_supporter_role,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            parentID: config.ticket_category.partnerApply,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const embed = new MessageEmbed()
                            .setTitle('__**Билет открыт!**__')
                            .setDescription(`Привет <@${interaction.user.id}>,\nПерсонал будет здесь как можно скорее.`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const parnerApplyEmbed2 = new MessageEmbed()
                            .setTitle(`✅ __**ПОДАТЬ ЗАЯВКУ НА ПАРТНЕРСТВО**__ ✅`)
                            .setDescription(`> Расскажите нам что-нибудь о себе!
${interaction.user}, пожалуйста, сообщите нам ваш вид деятельности и предложения.`)
                            .setColor(ee.color)

                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Забрать')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Заблокировать')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Закрыть')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                             content: `Здраствуйте <@${interaction.user.id}>, ожидайте  <@&954245147040817253>, <@&944151445828145152>`,
                            embeds: [embed, parnerApplyEmbed2],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        interaction.reply({
                            content: `Билет создан: ${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
                case "source-code":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: config.ticket_category.sourceCode,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: config.ticket_extra.ticket_supporter_role,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            parentID: config.ticket_category.sourceCode,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const embed = new MessageEmbed()
                            .setTitle('__**Билет на помощь Хелпера открыт!**__')
                            .setDescription(`Привет <@${interaction.user.id}>,\nПерсонал будет здесь как можно скорее, а пока сообщите нам свой вопрос по игре.`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Забрать')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Заблокировать')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Закрыть')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                             content: `Привет <@${interaction.user.id}>,ожидайте  <@&954245147040817253>, <@&954383804003393636>`,
                            embeds: [embed],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        interaction.reply({
                            content: `Билет создан:${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
            }
        } catch (err) {
            console.log(err)
        }
    })

    require("./ticket-events/ticket-options")(client);

}

