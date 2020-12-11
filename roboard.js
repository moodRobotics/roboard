const puppeteer = require('puppeteer')
var mqtt = require('mqtt')
const config = require('./config.js')
const name = 'roboboard'
const version = '0.0.1a'

//Open Chromium in full screen and load initial page
async function start() {
  const browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: config.defaultViewport,
    args: config.args,
  })
  let pages = await browser.pages()
  const pagei = pages[0]
  //   const page = await browser.newPage()
  await pagei.goto(config.splashUrl)
}

if (config.mqtt.host) {
  var client = mqtt.connect(config.mqtt.host)

  client.on('connect', function () {
    client.subscribe(config.mqtt.topic, function (err) {
      if (!err) {
        client.publish(config.mqtt.topic, 'Hello mqtt')
      }
    })
  })

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    // client.end()
  })
}

start()
