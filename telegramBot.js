process.env.NTBA_FIX_319 = 1

const config = require('./config.json')
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = config

// telegram bot
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })

const sendMoveFundMessage = ({ source, destination, coin, size }) => {
  const message = `Move ${size} ${coin} from ${source} to ${destination}`
  bot.sendMessage(TELEGRAM_CHAT_ID, message)
}

module.exports = { sendMoveFundMessage }
