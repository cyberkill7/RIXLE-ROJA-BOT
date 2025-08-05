const { MessageType } = require('@whiskeysockets/baileys')
const { sticker } = require('../../Lib/sticker-formatter')
module.exports = {
    name: ["stc"],
type: ["create"],
description: "create sticker with simple module",
utilisation: "#stc (reply)",
async execute(m) {
  // Sticker command temporarily disabled due to sharp dependency issues
  return m.reply('Sticker command is temporarily disabled due to dependency issues')
}
      }
