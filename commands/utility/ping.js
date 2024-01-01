const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde a mensagem com pong!'),
    async execute(interaction) {
        interaction.reply({
            content: 'Pong!',
            ephemeral: true
        })
    },
}