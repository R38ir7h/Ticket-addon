
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    name: "ticket-setup",
    aliases: [],
    description: "",
    cooldown: 0,
    userPermissions: ["ADMINISTARTOR"],
    botPermissions: [],

    run: async (client, message, args, ee) => {
        try {
            const generalHelp = new MessageButton().setCustomId('general-help').setEmoji("❓").setLabel('Общая помощь').setStyle('SECONDARY');
            const bugReport = new MessageButton().setCustomId('bug-report').setEmoji("💢").setLabel('Сообщение об ошибке').setStyle('SECONDARY');
            const orderBot = new MessageButton().setCustomId('order-bot').setEmoji("⭕").setLabel('Обращение к хантеру').setStyle('SECONDARY');
            const staffApply = new MessageButton().setCustomId('staff-apply').setEmoji("📝").setLabel('Персонал. Подать заявку').setStyle('SECONDARY');
            const partnerApply = new MessageButton().setCustomId('partner-apply').setEmoji("🤝").setLabel('Партнер. Подать заявку').setStyle('SECONDARY');
            const sourceCode = new MessageButton().setCustomId('source-code').setEmoji("❔").setLabel('Обращение к хелперу').setStyle('SECONDARY');


            const embed = new MessageEmbed()
                .setTitle(`Создать тикет | Заявку | Партнерство`)
                .setDescription("Чтобы открыть личный тикет поддержки выберие соотведственную кнопку в меню. Просьба не открывать тикет если в этом нет крайней необходимости!")
                .setFooter(message.guild.name + " - Copyright © 2017-2022 Сообщество fw-rebirth.com", message.guild.iconURL({
                    dynamic: true
                }))
                .setColor(ee.color)

            const Buttons = new MessageActionRow()
                .addComponents([generalHelp, bugReport, orderBot])

            const Buttons2 = new MessageActionRow()
                .addComponents([staffApply, partnerApply, sourceCode])

            const buttonsRow = [Buttons, Buttons2]

            message.channel.send({
                embeds: [embed],
                components: buttonsRow
            });
        } catch (e) {
            console.log(e)
        }
    }
};

