const { Events } = require('discord.js')
const { mexico , haru } = require('../json/channels.json')
const venda = require('../messageFunctions/venda/venda')

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        console.log('----------')
        if (mexico.vendaChannel.includes(message.channelId)) {
            venda.main(message, client)
        }
        
    },
};