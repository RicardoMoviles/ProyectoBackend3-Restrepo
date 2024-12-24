const {Command} = require("commander")

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>','Puerto que va a usar nuestro servidor', 8000)
    .option('--mode <mode>', 'Modo de trabajo en nuestro servidor', 'productio')
    .requiredOption('-u <user>', 'Usuario utilizando el aplicativo', 'No se ha declarado un usuario')
    .option('-l, --letters [letters ...]', 'letras especificas')
    .parse(process.argv)

// console.log('opciones: ', program.opts())
// console.log(program.args)

module.exports = { program };