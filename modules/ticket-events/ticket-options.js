const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const Discord = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const Data = require(`${process.cwd()}/models/ticket-user`);

module.exports = async (client) => {
    const description = {
        name: "Ticket-System Extra Options",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("interactionCreate", async (interaction) => {
        try {

            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            if (!interaction.isButton()) return;
            if (!["ticket-close", "ticket-reopen", "ticket-transcript", "ticket-delete", "ticket-lock", "ticket-unlock", "ticket-claim"].includes(interaction.customId)) return;

            if (interaction.member.roles.cache.has(config.ticket_extra.ticket_supporter_role)) {

                Data.findOne({
                    channelID: interaction.channel.id
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Данные для этого билета не найдены!`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    switch (interaction.customId) {
                        case "ticket-close":
                            if (data.closed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Этот тикет уже закрыт.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                closed: true
                            });

                            const CloseEmbed = new MessageEmbed()
                                .setDescription(`🔐 | Билет закрыт <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            const CloseEmbed2 = new MessageEmbed()
                                .setDescription(`\`\`\`
Управление билетами команды поддержки\`\`\``)
                                .setColor(ee.mediancolor)

                            const CloseButtons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setCustomId('ticket-transcript')
                                    .setLabel('Получить расшифровку')
                                    .setEmoji("📝")
                                    .setStyle('SUCCESS'),
                                    new MessageButton()
                                    .setCustomId('ticket-reopen')
                                    .setLabel('Заново открыть')
                                    .setEmoji("🔓")
                                    .setStyle('SECONDARY'),
                                    new MessageButton()
                                    .setCustomId('ticket-delete')
                                    .setEmoji("🗑️")
                                    .setLabel('Удалить')
                                    .setStyle('DANGER'),
                                )

                            const Closeuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(Closeuser, {
                                SEND_MESSAGES: false,
                                VIEW_CHANNEL: false,
                                ATTACH_FILES: false,
                                READ_MESSAGE_HISTORY: false,
                            });

                            interaction.reply({
                                embeds: [CloseEmbed, CloseEmbed2],
                                components: [CloseButtons]
                            })
                            // interaction.deferUpdate();
                            break;
                        case "ticket-reopen":
                            if (data.closed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Этот билет не заблокирован.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                closed: false
                            });

                            const Reopenuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(Reopenuser, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true,
                                READ_MESSAGE_HISTORY: true,
                            });


                            const reopenEmbed = new MessageEmbed()
                                .setDescription(`Билет заново открыл <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            interaction.reply({
                                embeds: [reopenEmbed]
                            })
                            // interaction.deferUpdate();
                            break;
                        case "ticket-transcript":
                            const TranscriptUser = interaction.guild.members.cache.get(data.userID)

                            const channel = interaction.channel;
                            const attachment = await discordTranscripts.createTranscript(channel, {
                                limit: -1,
                                returnBuffer: false,
                                fileName: `ticket-${data.channelIndex}.html`
                            });

                            const TranscriptClimedByUser = interaction.guild.members.cache.get(data.claimedBy)

                            if (TranscriptClimedByUser) {
                                const transcriptSendEmbed = new MessageEmbed()
                                    .setAuthor({
                                        name: TranscriptUser.user.tag,
                                        iconURL: TranscriptUser.user.displayAvatarURL({
                                            dynamic: true
                                        })
                                    })
                                    .setTitle(`📄 Стенограмма билета`)
                                    .setColor(ee.color)
                                    .setFooter({
                                        text: `${interaction.guild.name}`,
                                        iconURL: interaction.guild.iconURL({
                                            dynamic: true
                                        })
                                    })
                                    .setTimestamp()
                                    .setDescription(`
Стенограмма **${TranscriptUser.user.tag}** (${TranscriptUser.id})
Обработал: **${TranscriptClimedByUser.user.tag}** (${TranscriptClimedByUser.id})`)

                                const transcriptChannel = interaction.guild.channels.cache.get(config.ticket_extra.transcript_channel);
                                if (!transcriptChannel) return;

                                transcriptChannel.send({
                                    embeds: [transcriptSendEmbed],
                                    files: [attachment]
                                });

                            } else {
                                const transcriptSendEmbed = new MessageEmbed()
                                    .setAuthor({
                                        name: TranscriptUser.user.tag,
                                        iconURL: TranscriptUser.user.displayAvatarURL({
                                            dynamic: true
                                        })
                                    })
                                    .setTitle(`📄 Стенограмма билета`)
                                    .setColor(ee.color)
                                    .setFooter({
                                        text: `${interaction.guild.name}`,
                                        iconURL: interaction.guild.iconURL({
                                            dynamic: true
                                        })
                                    })
                                    .setTimestamp()
                                    .setDescription(`Стенограмма **${TranscriptUser.user.tag}** (${TranscriptUser.id})`)

                                const transcriptChannel = await interaction.guild.channels.cache.get(config.ticket_extra.transcript_channel);
                                if (!transcriptChannel) return;
                                transcriptChannel.send({
                                    embeds: [transcriptSendEmbed],
                                    files: [attachment]
                                });
                            }

                            const transcriptDMSendEmbed = new MessageEmbed()
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.displayAvatarURL({
                                        dynamic: true
                                    })
                                })
                                .setTitle(`📄 Расшифровка билетов от ${interaction.guild.name}`)
                                .setColor(ee.color)
                                .setDescription(`Стенограмма**${TranscriptUser.user.tag}** (${TranscriptUser.id})`)

                            if (TranscriptUser) {
                                TranscriptUser.send({
                                    embeds: [transcriptDMSendEmbed],
                                    files: [attachment]
                                }).catch(err => console.log("не могу расшифровать стенограмму"))
                            }

                            const transcriptEmbed = new MessageEmbed()
                                .setTitle(`📄 Стенограмма билета`)
                                .setColor(ee.color)
                                .setDescription(`Стенограмма сохранена в <#${config.ticket_extra.transcript_channel}>.`)

                            interaction.reply({
                                embeds: [transcriptEmbed]
                            });
                            // interaction.deferUpdate();
                            break;
                        case "ticket-delete":
                            interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Билет будет удален через 10 секунд!`)
                                    .setColor(ee.wrongcolor)
                                ]
                            })
                        
                            setTimeout(async () => {

                                await Data.findOneAndDelete({
                                    channelID: interaction.channel.id
                                });

                                interaction.channel.delete();
                            }, 10 * 1000)
                            //interaction.deferUpdate();
                            break;
                        case "ticket-lock":
                            if (data.closed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Этот билет закрыт, поэтому вы не можете его заблокировать.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            if (data.locked == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Этот билет уже заблокирован.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                locked: true
                            });

                            const Lockuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(Lockuser, {
                                SEND_MESSAGES: false,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: false,
                                READ_MESSAGE_HISTORY: true,
                            });

                            const lockEmbed = new MessageEmbed()
                                .setDescription(`Билет заблокировал <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            const lockEmbed2 = new MessageEmbed()
                                .setDescription(`\`\`\`Управление билетами команды поддержки\`\`\``)
                                .setColor(ee.mediancolor)

                            const lockButtons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setCustomId('ticket-unlock')
                                    .setLabel('Разблокировать')
                                    .setEmoji("🔓")
                                    .setStyle('SECONDARY'),
                                )

                            interaction.reply({
                                embeds: [lockEmbed, lockEmbed2],
                                components: [lockButtons]
                            })

                            // interaction.deferUpdate();
                            break;
                        case "ticket-unlock":
                            if (data.closed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Этот билет закрыт, поэтому вы не можете разблокировать.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            if (data.locked == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Этот билет не заблокирован.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                locked: false
                            });

                            const UnLockuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(UnLockuser, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true,
                                READ_MESSAGE_HISTORY: true,
                            });

                            const UnlockedEmbed = new MessageEmbed()
                                .setDescription(`Билет открыл <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            interaction.reply({
                                embeds: [UnlockedEmbed]
                            })
                            // interaction.deferUpdate();
                            break;
                        case "ticket-claim":
                            if (data.claimed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setDescription(`Этот билет уже востребован <@${data.claimedBy}>.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                claimed: true,
                                claimedBy: interaction.user.id
                            });

                            interaction.channel.permissionOverwrites.edit(interaction.user.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true,
                                READ_MESSAGE_HISTORY: true
                            });

                            const ClaimedEmbed = new MessageEmbed()
                                .setDescription(`Билет уже обрабатывает <@${interaction.user.id}>`)
                                .setColor(ee.color)

                            interaction.channel.edit({
                                name: `📂-t-${data.channelIndex}-${interaction.user.username}`
                            })

                            interaction.reply({
                                embeds: [ClaimedEmbed]
                            })

                            // interaction.deferUpdate();
                            break;
                    }
                })

            } else {
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **У вас нет необходимых ролей, чтобы прикасаться к этим кнопкам!**`)
                        .setColor(ee.wrongcolor)
                    ],
                    ephemeral: true
                })
            }


        } catch (err) {
            console.log(err)
        }
    })
}


