const { fromBuffer } = require('file-type')
const fetch = require('axios')

async function uploadImage(buffer) {
  const { ext } = await fromBuffer(buffer)
  const form = new FormData()
  form.append('file', buffer, 'tmp.' + ext)
  const res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })
  const img = await res.json()
  if (img.error) throw img.error
  return 'https://telegra.ph' + img[0].src
}

module.exports = { uploadImage }

