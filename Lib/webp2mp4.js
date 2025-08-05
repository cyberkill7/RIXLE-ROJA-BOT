const fetch = require('axios')
const FormData = require('form-data')
// const { JSDOM } = require('jsdom') // Disabled due to build issues

async function webp2mp4(source) {
  // Function disabled due to jsdom dependency issues
  throw new Error('webp2mp4 function is temporarily disabled due to dependency issues')
}

async function webp2png(source) {
  // Function disabled due to jsdom dependency issues
  throw new Error('webp2png function is temporarily disabled due to dependency issues')
}

if (require.main === module) {
  // TODO: Test
  console.log('Functions disabled due to jsdom dependency issues')
} else {
  module.exports = { webp2mp4, webp2png }
}
