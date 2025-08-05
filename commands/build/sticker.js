// const { MessageType } = require('@whiskeysockets/baileys')
// const { sticker } = require('../../Lib/sticker')
// const WSF = require('wa-sticker-formatter') // Disabled due to sharp dependency issues

module.exports = {
name: ["sticker"],
type: ["create"],
description: "create sticker with waf",
utilisation: "#sticker (reply)",
async execute(m) {
  // Sticker command temporarily disabled due to sharp dependency issues
  return m.reply('Sticker command is temporarily disabled due to dependency issues')
}
}

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
