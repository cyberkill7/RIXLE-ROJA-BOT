"use strict";
const fs = require("fs")
const qrcode = require("qrcode")
const cp = require('child_process')
const { makeWASocket, DisconnectReason, useMultiFileAuthState, MessageType } = require("@whiskeysockets/baileys");
const { Functions } = require('./Lib/Functions');
const { start } = require('./Lib/banner');
const { JsonDB } = require("node-json-db")
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

global['write'] = {};
global['write']['words'] = JSON.parse(fs.readFileSync('./tmp/debug.json')); // Biar Bingung Orang Awam, dan Susah Recode :v
global.antidelete = false
global.welcome = true
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.Ft = new Functions(); // Menghubungkan dari Function.js
global.mediaType = MessageType //Biar keren hehe
global.botuser = require('./src/config') //Menghubungkan Ke Connection string
global.userbot = require('./config') //Menghubungkan Ke config utama
global.Events = {}
global.baileys = "@whiskeysockets/baileys" //Hehe
global.db = new JsonDB(new Config("database", true, false, '/'));
global.Public = false
global.scrap = require("./Lib/scrape");
//msgTyp - Using string constants for message types
global.text = 'text'
global.image = 'image'
global.video = 'video'
global.audio = 'audio'
global.location = 'location'
global.document = 'document'

// Create connection
const { state, saveCreds } = useMultiFileAuthState('session')
global.conn = makeWASocket({
    auth: state
})

async function _quickTest() {
  let test = await Promise.all([
    cp.spawn('ffmpeg'),
    cp.spawn('ffprobe'),
    cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    cp.spawn('convert'),
    cp.spawn('magick'),
    cp.spawn('gm'),
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm] = test
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm
  }
  require('./Lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) conn.logger.warn('Silakan instal ffmpeg untuk mengirim video (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stiker tidak bisa dianimasikan tanpa libwebp di ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stiker mungkin tidak berfungsi tanpa imagemagick jika libwebp di ffmpeg tidak diinstal (pkg install imagemagick)')
}

_quickTest()
  .then(() => conn.logger.info('Quick Test Done'))
  .catch(console.error)

// Handle connection updates
conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if(connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect, '\n')
        if(shouldReconnect) {
            // Reconnect logic here if needed
        }
    } else if(connection === 'open') {
        console.log('opened connection')
        console.clear()
        start('\n', console.log('\n'))
    }
})

// Handle messages
conn.ev.on('messages.upsert', async (m) => {
    // Handle incoming messages here
    console.log('New message received')
})

setInterval(() => {
 conn.setStatus(`PREFIX: ${userbot.prefix} | BOT AKTIF: ${Ft.count(process.uptime())} | 𝐑𝐨𝐚𝐝 𝐓𝐨 𝟑𝟎 𝐉𝐮𝐳 🍂 | 𝐏𝐞𝐣𝐮𝐚𝐧𝐠 𝐒𝐡𝐨𝐥𝐚𝐰𝐚𝐭 | Listening Youtube🎧`).catch((_) => _)
},1000)

require('./src/loader');

async function run() {// Function biar bisa run bot
 let message = require('./action/chats');
 let action = require('./action/action');
 // conn.message = message.msg
 // conn.on('chat-update', conn.message);
 // conn.on('group-participants-update', action.groupUpdate); // ivan tolol
}
Ft.action()
run();// Menjalankan Bot
