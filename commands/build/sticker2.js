// const { MessageType } = require('@whiskeysockets/baileys') // Disabled due to sharp dependency issues
// const { sticker } = require('../../Lib/sticker') // Disabled due to sharp dependency issues
// const { createSticker, StickerTypes } = require("wa-sticker-formatter") // Disabled due to sharp dependency issues


module.exports = {
name: ["s"],
type: ["create"],
description: "create sticker with waf",
utilisation: "#s (reply)",
async execute(m) {
  // Sticker command temporarily disabled due to sharp dependency issues
  return m.reply('Sticker command is temporarily disabled due to dependency issues')
}
}

