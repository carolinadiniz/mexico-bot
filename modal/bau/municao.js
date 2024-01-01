const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = async (interaction) => {

    const modal = new ModalBuilder()
        .setCustomId('bauMuniModal')
        .setTitle('Relatório de Baú - México')

    const muniInput = new TextInputBuilder()
        .setCustomId('muniInput')
        .setLabel('Nome da Munição')
        .setPlaceholder('Ex: Five')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(2)
        .setMaxLength(15)

    const quantInput = new TextInputBuilder()
        .setCustomId('quantInput')
        .setLabel('Quantidade')
        .setPlaceholder('Ex: 200')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(5)

    const membroInput = new TextInputBuilder()
        .setCustomId('membroInput')
        .setLabel('Membro')
        .setPlaceholder('Quem receberá as munições?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(2)
        .setMaxLength(64)

    const firstActionRow = new ActionRowBuilder().addComponents(muniInput);
    const secondActionRow = new ActionRowBuilder().addComponents(quantInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(membroInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)

    await interaction.showModal(modal)

}