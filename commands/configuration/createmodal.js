const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleFlags } = require("discord.js");

module.exports = {
    category: 'configuration',
    data: new SlashCommandBuilder()
        .setName('createmodalaskset')
        .setDescription('Creates a message with button and a interaction with a modal.'),
    async execute(interaction) {
        const embedPediSet = new EmbedBuilder()
            .setColor('#006341')
            .setTitle('Pedir Set - México')
            .setDescription("Sistema para pedir set exclusivo do méxico!\n\nPara pedir seu set, clique no botão:")
            .setThumbnail('https://s1.1zoom.me/b5050/706/339091-Berserker_3840x2400.jpg');

        const iniciar = new ButtonBuilder()
            .setCustomId('pedirset')
            .setLabel('Iniciar')
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
            .addComponents(iniciar)

        interaction.guild.channels.cache.get("1190939967585796166").send({
            embeds: [embedPediSet],
            components: [row]
        })

    }
}