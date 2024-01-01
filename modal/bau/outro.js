const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = async (interaction) => {

    const modal = new ModalBuilder()
        .setCustomId('bauOutroModal')
        .setTitle('Relatório de Baú - México')

    const outroInput = new TextInputBuilder()
        .setCustomId('outroInput')
        .setLabel('Nome do Item')
        .setPlaceholder('Ex: Machado')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(2)
        .setMaxLength(11)

    const quantInput = new TextInputBuilder()
        .setCustomId('quantInput')
        .setLabel('Quantidade')
        .setPlaceholder('Ex: 3')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(6)

    const membroInput = new TextInputBuilder()
        .setCustomId('membroInput')
        .setLabel('Membro')
        .setPlaceholder('Quem receberá o item?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(2)
        .setMaxLength(64)

    const firstActionRow = new ActionRowBuilder().addComponents(outroInput);
    const secondActionRow = new ActionRowBuilder().addComponents(quantInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(membroInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)

    await interaction.showModal(modal)

}