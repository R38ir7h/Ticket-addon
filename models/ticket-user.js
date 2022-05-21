const {
    Schema,
    model
} = require('mongoose');

const Ticket = new Schema({
    guildID: String,
    userID: String,
    channelID: String,
    parentID: String,
    channelIndex: Number,
    closed: Boolean,
    locked: Boolean,
    claimed: Boolean,
    claimedBy: String
})

module.exports = model("ticket-users", Ticket);
