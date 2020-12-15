const os = require('os')
const fs = require('fs')
const prompt = require('prompt-sync')()
const puppeteer = require('puppeteer')
var mqtt = require('mqtt')
const config = require('./config.js')
const name = 'roboard'
const version = '0.1.4-a'
const configFilename = 'config.json'
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
    executablePath: config.executablePath,
  })
  let pages = await browser.pages()
  page = pages[0]
  //   const page = await browser.newPage()
  await page.goto(config.splashUrl)
}

// First Time input data
let configFile = {}
try {
  var contents = fs.readFileSync(configFilename, 'utf8')
  console.log(contents)
  configFile = JSON.parse(contents)
} catch (e) {
  console.log('config.json ERROR')
}
if (!configFile.name) {
  const name = prompt('What is the device name? (' + hostname + '): ')
  configFile.deviceName = name
  const url = prompt('What is the splashUrl? (http://moodrobotics.com): ')
  configFile.splashUrl = url
  const host = prompt('What is the MQTT server? (mqtt://DOMAIN:1883): ')
  configFile.mqtt = {host: host}
  const info = prompt('Topic info? (/company/device/info): ')
  configFile.mqtt.infotopic = info
  const commands = prompt('Topic commands? (/company/device/commands): ')
  configFile.mqtt.commandtopic = commands

  fs.writeFile(configFilename, JSON.stringify(configFile), (err) => {
    if (err) {
        throw err;
    }
    console.log(configFilename+" is saved.");
});
}

// MQTT connection
if (configFile.mqtt.host) {
  var client = mqtt.connect(configFile.mqtt.host)

  client.on('connect', function () {
    client.subscribe(configFile.mqtt.commandtopic, function (err) {
      if (!err) {
        client.publish(configFile.mqtt.infotopic, 'init ' + name + ' v.' + version)
      } else {
        console.log('mqtt error ', err)
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
        client.publish(configFile.mqtt.infotopic, 'loading ' + url)
        page
          .goto(url)
          .then(client.publish(configFile.mqtt.infotopic, 'loaded ' + url))
        break
      default:
    }
  })
}

start()
