
const {
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "ping",
  aliases: ["latency"],
  usage: '',
  description: "Gives you information on how fast the Bot can respond to you",
  cooldown: 10,
  userPermissions: [],
  botPermissions: [],
  ownerOnly: false,
  toggleOff: false,

  run: async (client, message, args, ee) => {
    try {
      message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`🔍 Checking Ping...`)]}).then(msg => {
        const ping = msg.createdTimestamp - message.createdTimestamp;
        msg.edit({embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setDescription(`🤖 **Bot Ping:** \`${(Date.now() - message.createdTimestamp)}ms\`\n\n⌛ **Api Latency:** \`${Math.round(client.ws.ping)}ms\``)]}
        );
      }).catch(e => message.channel.send(e));
    } catch (e) {
      console.log(e)
    }
  },
};

