// Commands Module
const config = require('../../botconfig/config.json');
const {
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: '',
  aliases: [],
  usage: '',
  description: '',
  cooldown: 0,
  userPermissions: [],
  botPermissions: [],
  ownerOnly: false,
  toggleOff: false,

  run: async (client, message, args, ee) => {
    try {
      // Start Coding
    } catch (err) {
      console.log(err)
    }
  }
}
// Commands Module End

// ---------------------------------------------------

// Slash Commands Module
const config = require('../../botconfig/config.json');
const {
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: '',
  description: '',
  cooldown: 0,
  userPermissions: [],
  botPermissions: [],
  ownerOnly: true,
  toggleOff: true,

  run: async (client, interaction, args, ee) => {
    try {
      // Start Coding
    } catch (err) {
      console.log(err)
    }
  }
}
// Slash Commands Module End

