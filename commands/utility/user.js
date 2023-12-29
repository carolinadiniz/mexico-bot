const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Mostra informações sobre o usuário.'),
    async execute(interaction) {
        await interaction.reply(`Este comando foi executado por ${interaction.user.username}, que entrou no servidor em ${interaction.member.joinedAt}.`);
    },
};