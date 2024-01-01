const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = async (interaction) => {

    const modal = new ModalBuilder()
        .setCustomId('bauColeteModal')
        .setTitle('Relatório de Baú - México')

    const quantInput = new TextInputBuilder()
        .setCustomId('quantInput')
        .setLabel('Quantidade')
        .setPlaceholder('Ex: 3')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2)

    const secondActionRow = new ActionRowBuilder().addComponents(quantInput);

    modal.addComponents(secondActionRow)

    await interaction.showModal(modal)

}