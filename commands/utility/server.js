const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Mostra informações sobre o servidor.'),
    async execute(interaction) {
        await interaction.reply(`Este é o servidor ${interaction.guild.name} e tem ${interaction.guild.memberCount} members.`);
    },
};