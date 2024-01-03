const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, embedLength, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js')
const wait = require('node:timers/promises').setTimeout
const armaModal = require('../modal/bau/arma')
const muniModal = require('../modal/bau/municao')
const coleteModal = require('../modal/bau/colete')
const outroModal = require('../modal/bau/outro')
const { mexico, haru } = require('../json/channels.json')

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
            } else if (interaction.customId === 'formbau') {

                const embed = new EmbedBuilder()
                    .setTitle("Qual categoria de item está sendo retirado?")


                const arma = new ButtonBuilder()
                    .setCustomId('bau_arma')
                    .setLabel('Arma')
                    .setStyle(ButtonStyle.Secondary)

                const municao = new ButtonBuilder()
                    .setCustomId('bau_muni')
                    .setLabel('Munição')
                    .setStyle(ButtonStyle.Secondary)

                const colete = new ButtonBuilder()
                    .setCustomId('bau_colete')
                    .setLabel('Colete')
                    .setStyle(ButtonStyle.Secondary)

                const outro = new ButtonBuilder()
                    .setCustomId('bau_outro')
                    .setLabel('Outro')
                    .setStyle(ButtonStyle.Secondary)

                let row = new ActionRowBuilder()
                    .addComponents(arma, municao, colete, outro)

                interaction.reply({
                    ephemeral: true,
                    components: [row],
                    embeds: [embed]
                }).then(
                    /*
                    msg => setTimeout(() => {
                        msg.delete()
                    }, 15000)*/
                )


            } else if (interaction.customId === 'bau_arma') {
                await armaModal(interaction)
            } else if (interaction.customId === 'bau_muni') {
                await muniModal(interaction)
            } else if (interaction.customId === 'bau_colete') {
                await coleteModal(interaction)
            } else if (interaction.customId === 'bau_outro') {
                await outroModal(interaction)
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
                        }, 15000);
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
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`)

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

                let row = new ActionRowBuilder()
                    .addComponents(aprovar, reprovar)


                await interaction.guild.channels.cache.get(channelIDPedirSet).send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embedSet],
                    components: [row],
                })

            }

            if (interaction.customId === 'bauArmaModal') {

                const armaInput = interaction.fields.getTextInputValue('armaInput')
                const quantInput = interaction.fields.getTextInputValue('quantInput')
                const membroInput = interaction.fields.getTextInputValue('membroInput')

                const embedSet = new EmbedBuilder()
                    .setTitle('Armamento')
                    .addFields(
                        { "name": "Arma", "value": armaInput, "inline": true },
                        { "name": "Quantidade", "value": quantInput, "inline": true },
                        { "name": "Membro", "value": membroInput, "inline": false }
                    )
                    .setFooter({
                        text: interaction.member.nickname,
                        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`
                    })
                    .setTimestamp(interaction.message.createTimestamp)

                const guildId = interaction.guildId
                await client.guilds.cache.get(guildId).channels.cache.get(mexico.bauChannel).send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embedSet]
                })
                await interaction.update({
                    content: 'Formulário enviado com sucesso!',
                    embeds: [],
                    components: []
                })
                .then( msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                    
                })
            }

            if (interaction.customId === 'bauMuniModal') {

                const muniInput = interaction.fields.getTextInputValue('muniInput')
                const quantInput = interaction.fields.getTextInputValue('quantInput')
                const membroInput = interaction.fields.getTextInputValue('membroInput')

                const embedSet = new EmbedBuilder()
                    .setTitle('Munição')
                    .addFields(
                        { "name": "Arma", "value": muniInput, "inline": true },
                        { "name": "Quantidade", "value": quantInput, "inline": true },
                        { "name": "Membro", "value": membroInput, "inline": false }
                    )
                    .setFooter({
                        text: interaction.member.nickname,
                        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`
                    })
                    .setTimestamp(interaction.message.createTimestamp)

                const guildId = interaction.guildId
                await client.guilds.cache.get(guildId).channels.cache.get(mexico.bauChannel).send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embedSet]
                })
                await interaction.update({
                    content: 'Formulário enviado com sucesso!',
                    embeds: [],
                    components: []
                })
                .then( msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                    
                })
            }


            if (interaction.customId === 'bauColeteModal') {

                const quantInput = interaction.fields.getTextInputValue('quantInput')

                const embedSet = new EmbedBuilder()
                    .setTitle('Colete')
                    .addFields(
                        { "name": "Quantidade", "value": quantInput, "inline": true }
                    )
                    .setFooter({
                        text: interaction.member.nickname,
                        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`
                    })
                    .setTimestamp(interaction.message.createTimestamp)

                const guildId = interaction.guildId
                await client.guilds.cache.get(guildId).channels.cache.get(mexico.bauChannel).send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embedSet]
                })
                await interaction.update({
                    content: 'Formulário enviado com sucesso!',
                    embeds: [],
                    components: []
                })
                .then( msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                    
                })
            }

            if (interaction.customId === 'bauOutroModal') {

                const outroInput = interaction.fields.getTextInputValue('outroInput')
                const quantInput = interaction.fields.getTextInputValue('quantInput')
                const membroInput = interaction.fields.getTextInputValue('membroInput')

                const embedSet = new EmbedBuilder()
                    .setTitle('Outro')
                    .addFields(
                        { "name": "Item", "value": outroInput, "inline": true },
                        { "name": "Quantidade", "value": quantInput, "inline": true },
                        { "name": "Membro", "value": membroInput, "inline": false }
                    )
                    .setFooter({
                        text: interaction.member.nickname,
                        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`
                    })
                    .setTimestamp(interaction.message.createTimestamp)

                const guildId = interaction.guildId
                await client.guilds.cache.get(guildId).channels.cache.get(mexico.bauChannel).send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embedSet]
                })
                await interaction.update({
                    content: 'Formulário enviado com sucesso!',
                    embeds: [],
                    components: []
                })
                .then( msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                    
                })
            }
        }
    },
};