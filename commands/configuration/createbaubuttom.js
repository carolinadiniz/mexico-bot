const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleFlags } = require("discord.js");
const { mexico, haru } = require('../../json/channels.json')
module.exports = {
    category: 'configuration',
    data: new SlashCommandBuilder()
        .setName('createbaubutton')
        .setDescription('Creates a message with a button and interaction with a modal.'),
    async execute(interaction) {
        const embedBau = new EmbedBuilder()
            .setColor('#006341')
            .setTitle('Relatório de Baú')
            .setDescription("Sistema para preencher o relatório do baú\n\nPara iniciar, clique no botão:")
            .setThumbnail('https://s1.1zoom.me/b5050/706/339091-Berserker_3840x2400.jpg');

        const iniciar = new ButtonBuilder()
            .setCustomId('formbau')
            .setLabel('Iniciar')
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
            .addComponents(iniciar)

        interaction.guild.channels.cache.get(mexico.bauButtonChannel).send({
            embeds: [embedBau],
            components: [row]
        })
    }
}