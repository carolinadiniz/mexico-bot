const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, embedLength } = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'pedirset') {

                const modal = new ModalBuilder()
                    .setCustomId('pedirSetModal')
                    .setTitle('Pedir Set - México')

                const nameInput = new TextInputBuilder()
                    .setCustomId('nameInput')
                    .setLabel('Nome Completo')
                    .setPlaceholder('Digite seu nome do jogo')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(3)
                    .setMaxLength(64)

                const idInput = new TextInputBuilder()
                    .setCustomId('idInput')
                    .setLabel('Número ID')
                    .setPlaceholder('Digite seu ID do jogo')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(6)

                const celularInput = new TextInputBuilder()
                    .setCustomId('celularInput')
                    .setLabel('Número Telefone')
                    .setPlaceholder('Digite seu número de telefone do jogo')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(6)
                    .setMaxLength(7)

                const recrutadorInput = new TextInputBuilder()
                    .setCustomId('recrutadorInput')
                    .setLabel('Recrutador')
                    .setPlaceholder('Digite o nome de quem está te recrutando')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(3)
                    .setMaxLength(64)

                const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
                const secondActionRow = new ActionRowBuilder().addComponents(idInput);
                const thirdActionRow = new ActionRowBuilder().addComponents(celularInput);
                const fourthActionRow = new ActionRowBuilder().addComponents(recrutadorInput);

                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

                await interaction.showModal(modal)


            } else if (interaction.customId === 'aprovar' || interaction.customId === 'reprovar') {
                if (interaction.customId === 'aprovar') {
                    let nome, id, celular, recrutador;

                    interaction.message.embeds[0].data.fields.forEach(data => {
                        switch (data.name) {
                            case 'Nome':
                                nome = data.value;
                                break;
                            case 'ID':
                                id = data.value;
                                break;
                            case 'Celular':
                                celular = data.value;
                                break;
                            case 'Recrutador':
                                recrutador = data.value;
                                break;
                            default:
                                break;
                        }
                    })

                    const userId = interaction.message.content.replace("<@", "").replace(">", "")
                    const guild = await client.guilds.fetch("607043030360391730")
                    const member = await guild.members.fetch(userId)
                    const role = await guild.roles.fetch('1169271957372534885')

                    await member.roles.add(role)
                    await member.setNickname(`${nome} | ${id}`)

                    interaction.message.embeds[0].data['color'] = 392960
                    interaction.message.embeds[0].data['footer'] = {
                        text: `Aprovado por: ${interaction.member.nickname}`
                    }

                    interaction.update({
                        embeds: interaction.message.embeds,
                        components: [],
                    })

                } else {
                    const userId = interaction.message.content.replace("<@", "").replace(">", "")
                    const guild = await client.guilds.fetch("607043030360391730")
                    const member = await guild.members.fetch(userId)
                    const role = await guild.roles.fetch('1169271957372534885')

                    await member.roles.set([])
                    await member.setNickname(`${member.user.globalName} | Reprovado`)

                    interaction.message.embeds[0].data['color'] = '16711680'
                    interaction.message.embeds[0].data['footer'] = {
                        text: `Reprovado por: ${interaction.member.nickname}`
                    }

                    interaction.update({
                        embeds: interaction.message.embeds,
                        components: [],
                    })
                }
            }



        } else if (interaction.isStringSelectMenu()) {
            // respond to the select menu
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'pedirSetModal') {
                //console.log(interaction)
                await interaction.reply({
                    content: 'Seu pedido foi recebido com sucesso!\nAguarde até que um moderador libere seu acesso.',
                    ephemeral: true
                })
                    .then(msg => {
                        setTimeout(() => {
                            msg.delete()
                        }, 30000);
                    })


                const nameInput = interaction.fields.getTextInputValue('nameInput')
                const idInput = interaction.fields.getTextInputValue('idInput')
                const celularInput = interaction.fields.getTextInputValue('celularInput')
                const recrutadorInput = interaction.fields.getTextInputValue('recrutadorInput')

                const channelIDPedirSet = '1169272011479072849';

                const embedSet = new EmbedBuilder()
                    .addFields(
                        { "name": "Nome", "value": nameInput, "inline": false },
                        { "name": "ID", "value": idInput, "inline": false },
                        { "name": "Celular", "value": celularInput, "inline": false },
                        { "name": "Recrutador", "value": recrutadorInput, "inline": false }
                    )

                const aprovar = new ButtonBuilder()
                    .setCustomId('aprovar')
                    .setLabel('Aprovar')
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Success)

                const reprovar = new ButtonBuilder()
                    .setCustomId('reprovar')
                    .setLabel('Reprovar')
                    .setEmoji("✖️")
                    .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder()
                    .addComponents(aprovar, reprovar)


                await interaction.guild.channels.cache.get(channelIDPedirSet).send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embedSet],
                    components: [row],
                })

            }

        }
    },
};