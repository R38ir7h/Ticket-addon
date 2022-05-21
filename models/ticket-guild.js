const {
    Schema,
    model
} = require('mongoose');

const Tickets = new Schema({
    guildID: String,
    index: Number
})

module.exports = model("ticket-guilds", Tickets);

