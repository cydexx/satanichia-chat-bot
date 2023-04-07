const { Client, IntentsBitField } = require("discord.js")
const { Configuration, OpenAIApi } = require("openai")
require("dotenv/config")

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
})
const openai = new OpenAIApi(configuration)

client.on("messageCreate", async (message) => {
    if (message.author.bot) return
    if (message.channel.id !== process.env.CHANNEL_ID) return
    if (message.content.startsWith("!") || message.content.startsWith("."))
        return //enable it if you don't want to use specific channel setup.

    let conversationLog = [
        { role: "system", content: "You are a friendly chatbot." },
    ]

    try {
        await message.channel.sendTyping()

        let prevMessages = await message.channel.messages.fetch({ limit: 25 })
        prevMessages.reverse()

        prevMessages.forEach((msg) => {
            if (message.content.startsWith("!")) return
            if (msg.author.id !== client.user.id && message.author.bot) return
            if (msg.author.id !== message.author.id) return

            conversationLog.push({
                role: "user",
                content: msg.content,
            })
        })

        const result = await openai
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: conversationLog,
                //max_tokens: 256, // limit token usage
            })
            .catch((error) => {
                console.log(`OPENAI Error: ${error}`)
            })

        message.reply(result.data.choices[0].message)
        console.log(
            message.author.username,
            ":\nQ:",
            message.content,
            "\nA:",
            result.data.choices[0].message.content
        ) //console logging every questions with username and q&a prompts
    } catch (error) {
        console.log(`Error: ${error}`)
    }
})

//const logPromptsToConsole = () => { } //!TO-DO: get prompts and log to console.

client.login(process.env.TOKEN)

client.on("ready", () => {
    console.log(` 
  ⠀⠀⡜⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⢣⣖⠠⠛⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡷⠀⠉⢷⡀⠀⠈⢧⠱⡄⠀⠙⣿⣯⠀
  ⠀⠀⡜⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣷⠃⠈⢧⡃⢜⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣏⠀⠀⠀⠙⢆⠀⠈⣷⢱⡀⠀⠘⢿⣇
  ⠀⢰⠣⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠃⠀⠀⠀⢻⣄⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠶⠶⠶⠒⠋⠳⣄⠚⣧⢧⠀⠀⠀⢻
  ⠀⢸⡐⠁⠀⠀⠀⠀⠀⠀⠀⣴⡟⠁⠀⢀⣠⣤⠖⠻⡄⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣏⠀⠀⠀⠀⠀⠀⠙⢮⡸⡞⣆⠀⠀⠀
  ⠀⡒⣘⠀⠀⠀⠀⠀⠀⢤⣼⡿⠴⠶⠛⠛⠉⠀⡀⠀⠹⣾⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣡⣫⠗⠀⠀⠀⠀⠀⠈⠳⣿⣸⠀⠀⠀
  ⠀⡱⠤⡁⠀⠀⠀⠀⢠⣾⠟⠀⠀⠀⢀⣠⠴⢋⢳⠀⠀⢹⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣻⣇⠃⠀⠀
  ⠀⣇⠒⡁⠀⠀⢀⣴⣻⠏⠀⠀⠀⠀⠉⠉⠉⠙⠚⠇⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠃⣀⣠⣤⠤⢀⣀⣤⣶⣼⡄⢸⣿⡄⠀⠀
  ⠀⡧⡉⡔⠀⢠⠞⡴⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⡇⠀⠀⠀⠀⠀⠀⠀⣴⢿⣏⣩⣥⣴⣶⣿⣿⣿⣿⢿⣿⠀⣸⣿⡇⠀⠀
  ⠰⣷⠡⡘⢄⣣⠞⠁⠀⠀⠀⣀⣀⣤⣤⠴⠶⠖⣦⡀⠀⠀⠈⣷⠀⠀⠀⠀⠀⢀⡾⢡⡾⣿⣿⣿⣿⣿⣿⠛⣿⡿⢠⡇⠀⣿⣚⣷⠀⠀
  ⠸⣧⢃⣼⣞⣡⣤⣤⣤⣤⣴⣴⣾⣶⣶⣿⣶⣶⣶⡟⠀⠀⠀⢹⠀⠀⠀⢀⡴⢋⢔⡿⠹⠓⠀⣿⣿⣿⣿⠀⣿⡟⠈⠀⠄⣿⡜⣿⠀⠀
  ⠘⡷⠋⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⢻⣿⡟⢻⠛⠂⠀⠀⣸⠀⢀⡴⢋⠔⣡⠞⠀⠀⠀⠀⢿⣿⣿⣿⣤⣿⠃⠀⠠⠀⣿⢺⣽⡂⠀
  ⢈⡷⠀⠈⢿⡄⠀⠀⢸⣿⣿⣿⣿⣿⠀⠈⣿⡇⠀⠀⠀⠀⠀⣿⠒⠭⣐⢡⡾⠋⠀⠀⠀⠀⠀⠸⣿⣿⣱⣿⠏⠀⠀⡀⠁⢻⡳⢾⡇⠀
  ⠀⣿⠀⠀⠈⠳⠀⠀⠈⣿⣿⣿⣟⣿⣧⣴⣿⡇⠀⠀⠀⠀⢠⡟⢌⣱⠶⠋⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠉⠁⠀⠀⠄⠀⠀⢸⣿⣹⡇⠀
  ⠠⢹⡄⠀⠀⠀⠠⡀⠀⠘⣿⣿⣟⣧⡯⠿⡿⠁⠀⠀⠀⠀⡼⠗⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⢀⠀⢂⠁⠠⠈⠀⠸⣧⢻⡇⠀
  ⠠⡙⡇⠀⡀⠁⠀⠈⠀⠀⠀⠀⠀⠀⠒⠂⠀⠀⡀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠠⠀⠂⠀⠂⠀⠁⠠⢸⣿⣹⡇⠀
  ⠠⡑⢿⠀⠀⠀⠁⠠⠈⠀⠂⢀⠂⠄⡀⠄⠈⠀⠄⠀⠀⠀⣀⠀⠀⠀⣀⣠⣴⣶⣤⣤⡴⠋⠀⠀⠀⠀⠄⠀⠁⠀⠁⠠⢠⣿⣷⣹⠇⠀
  ⠠⡑⢺⣧⠀⠁⠀⠄⠀⠂⠀⠄⠠⠀⠄⠀⠁⠄⠀⠀⠈⠀⢸⡿⣿⡟⣻⢛⠿⣿⣿⣿⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣱⣿⢫⣷⣹⠃⠀
  ⠀⡑⠢⣿⣧⡄⠀⠄⠀⠀⠁⠀⠀⠀⠄⠀⠄⠀⠀⠀⠀⠁⣿⠲⣍⠲⠥⣎⠳⣰⠹⣿⠆⠀⠀⠀⠀⠀⠀⠀⠀⣰⣾⡟⣼⢻⡧⣿⠀⠀
  ⠀⢡⠃⡼⣿⣿⣶⣄⠠⠀⠀⢀⣤⠤⣤⣄⣀⠀⠠⠀⠀⠁⣿⠱⡎⢭⠓⣌⢣⢣⡝⣼⠃⠀⠀⠀⣀⡤⠶⠒⠛⣿⢧⡻⣜⣿⢳⡟⠀⠀
  ⠀⢠⠃⠖⣹⣿⣿⣿⣿⣶⣤⣸⣧⣄⠀⠀⠉⠛⢦⡀⠀⠀⠘⣧⡝⣊⠷⡌⢖⢣⣼⠏⠀⣀⡴⠋⠁⠀⠀⣀⣴⡿⣣⢿⣼⣟⣳⡏⠀⠀
  ⠀⠠⣉⠚⠤⣿⣿⣿⣿⣿⣿⣭⣛⣮⡝⢦⡀⠀⠈⢳⡄⠀⠀⠈⠙⠲⠷⠼⠟⠞⢁⣠⠞⠋⠀⠀⠀⣴⣯⣾⣿⣷⡹⣞⣾⢣⣿⠀⠀⠀
  ⠀⠀⢢⠙⡰⡈⢿⣿⣿⣿⣿⣿⣿⣾⣿⣆⠃⠀⠀⠀⢻⡶⣤⣤⣄⣀⣀⣤⠶⠚⠉⠀⠀⠀⠀⣀⣴⣿⣿⣿⣿⣿⣿⣞⢧⣻⢏⠀⠀⠀
  ⠀⠀⢠⠩⠔⣡⠊⢿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠙⠷⢾⠾⠛⠉⠀⠀⠀⠀⠀⣀⣴⠞⢹⣿⣿⣿⣿⣿⡿⣫⠞⣧⣿⠂⠀⠀⠀
  ⢄⡀⠀⢃⠎⢤⡉⢆⠻⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⠁⠀⣼⣿⣿⣿⣯⣷⣹⣵⣿⣿⢛⠀⠀⠀⠀
  ⠢⠜⡐⢌⡸⢄⠚⡄⠣⢌⠻⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⠟⠁⠀⠀⢠⣟⣿⣿⣿⣿⣿⣿⣿⡿⢁⠂⠀⠀⠀⠀

         Satanichia AI-BOT ready to serve.`)
})
