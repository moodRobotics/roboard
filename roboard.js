const os = require('os');
const puppeteer = require('puppeteer')
var mqtt = require('mqtt')
const config = require('./config.js')
const name = 'roboard'
const version = '0.0.1a'
const hostname = os.hostname()
const architecture = os.arch()
let freemem = os.freemem()
let loadavg = os.loadavg()
let page

//Open Chromium in full screen and load initial page
async function start() {
  const browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: config.defaultViewport,
    args: config.args,
    executablePath: config.executablePath
  })
  let pages = await browser.pages()
  page = pages[0]
  //   const page = await browser.newPage()
  await page.goto(config.splashUrl)
}

if (config.mqtt.host) {
  var client = mqtt.connect(config.mqtt.host)

  client.on('connect', function () {
    client.subscribe(config.mqtt.commandtopic, function (err) {
      if (!err) {
        client.publish(config.mqtt.infotopic, 'init '+name+" v."+version)
      }else{
        console.log("mqtt error ",err)
      }
    })
  })

  client.on('message', function (topic, message) {
    let command = message.toString().split(' ')[0].toLowerCase()
    // message is Buffer
    console.log('command: ' + command + '  ' + message.toString())
    // client.end()
    switch (command) {
      case 'goto':
        const url = message.toString().split(' ')[1]
        client.publish(config.mqtt.infotopic, 'loading ' + url)
        page
          .goto(url)
          .then(client.publish(config.mqtt.infotopic, 'loaded ' + url))
        break
      default:
    }
  })
}

start()
