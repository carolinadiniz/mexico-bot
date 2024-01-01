const createVenda = require('./createVenda')

module.exports = {
    main: (message, client) => {
        message.content = message.content.toLowerCase();
        
        if (isNaN(message.content.split(' ')[0])) return;
        if (!createVenda.verificaMunicao(message)) return;

        venda = createVenda.criaObjVenda(message, client);
        venda = createVenda.defineVendedor(message, client, venda)
        createVenda.createMessage(message, client, venda)

        console.log("ok")
    },
}