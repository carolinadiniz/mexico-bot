const { EmbedBuilder } = require('discord.js')
const municao = require('../../json/municao.json')
const roles = require('../../json/roles.json')
const venda = require('./venda')
const interactionCreate = require('../../events/interactionCreate')

module.exports = {
    verificaMunicao: (message) => {
        let municaoArrayFull = []
        const municaoArray = Object.keys(municao).map(element => municao[element].prefix)
        municaoArray.forEach(municao => {
            municaoArrayFull = municaoArrayFull.concat(municao)
        })
        return municaoArrayFull.includes(message.content.split(' ')[1])
    },
    criaObjVenda: (message, client) => {
        message.content = message.content.toLowerCase()
        let venda = {}
        venda.parceria = false
        venda.armas = {}
        venda.valorTotal = 0
        venda.timestamp = message.timestamp

        // verifica se há mais de uma operação
        message.content.split(' + ').forEach(operacao => {

            // formata informações
            let [quant, prefix, parceria] = operacao.split(' ')

            // insere informaçoes de parceira
            if (parceria && (parceria === "p" || parceria === "parceria")) {
                venda.parceria = true
            }

            if (!isNaN(quant)) {
                Object.keys(municao).forEach(arma => {
                    // verifica a arma correta
                    if (municao[arma].prefix.includes(prefix)) {
                        venda.armas[arma] = {
                            nome: municao[arma].nome,
                            valorUnitario: venda.parceria ? municao[arma].preco - 100 : municao[arma].preco,
                            quant: parseInt(quant)
                        }
                        venda.armas[arma].valorTotal = quant * venda.armas[arma].valorUnitario
                        venda.valorTotal += venda.armas[arma].valorTotal
                    }
                })
            }

        })

        return venda;
    },

    defineVendedor: (message, client, venda) => {
        vendedor = {}
        vendedor.globalName = message.author.globalName,
        vendedor.nickName = client.guilds.cache.get(message.guildId).members.cache.get(message.author.id).nickname
        vendedor.id_discord = message.author.id
        vendedor.avatar = message.author.avatar
        vendedor.cargo = {}

        const cargos = Object.keys(roles)

        for (let i = cargos.length - 1; i >= 0; i--) {
            let found = message.member.roles.cache.some(role => roles[cargos[i]].id.includes(role.id))
            if (found) {
                vendedor.cargo.percent = roles[cargos[i]].percent;
                break
            }
        }

        venda.vendedor = vendedor
        venda.valorDeposito = venda.valorTotal - (venda.valorTotal * vendedor.cargo.percent);

        return venda
    },

    createMessage: (message, client, venda) => {
        field = []
        Object.keys(venda.armas).forEach( arma => {
            field.push({ 'name':'Nome', "value": `${venda.armas[arma].nome}`, 'inline':true })
            field.push({ 'name':'Quantidade', "value": `${venda.armas[arma].quant}`, 'inline':true })
            field.push({ 'name':' ', "value": ' ', 'inline':true })
        })
        field.push({ 'name':'Parceria', "value": `${venda.parceria ? 'Sim': 'Não'}`, 'inline':false })
        field.push({ 'name':'Valor Venda', "value": `R$ **${venda.valorTotal}**`, 'inline':true })
        field.push({ 'name':'Valor Deposito', "value": `R$ ${venda.valorDeposito}`, 'inline':true })

        const embed = new EmbedBuilder()
            .setFooter({
                text: venda.vendedor.nickName ? venda.vendedor.nickName : venda.vendedor.globalName,
                iconURL: `https://cdn.discordapp.com/avatars/${venda.vendedor.id_discord}/${venda.vendedor.avatar}.jpg`
            })
            .setTimestamp(venda.timestamp)

        field.forEach( field => {
            embed.addFields(field)
        })

        message.channel.send({
            content: `<@${venda.vendedor.id_discord}>`,
            embeds: [embed]
        })

        message.delete()
    }

}