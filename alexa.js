const { alexa_helper } = require('./mmi_modules')

const run = async () => {
    try {
        const alexa = await alexa_helper(process.argv[2])
        console.log(alexa)
    } catch (error) {
        console.log(error)
    }
}
run()