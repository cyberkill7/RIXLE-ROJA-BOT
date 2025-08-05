// const tesseract = require("node-tesseract-ocr") // Disabled due to dependency issues

module.exports = {
 name: ['ocr'],
 type: ['default'],
 description: "untuk memindahkan text dari image ke dalam bentuk teks",
 utilsation: userbot.prefix + "ocr",
 
async execute(m) {
  // OCR command temporarily disabled due to dependency issues
  return m.reply('OCR command is temporarily disabled due to dependency issues')
}
}
