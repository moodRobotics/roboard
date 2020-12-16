const os = require('os')
const fs = require('fs')
const prompt = require('prompt-sync')()
const puppeteer = require('puppeteer')
var mqtt = require('mqtt')
const config = require('./config.js')
const name = 'roboard'
const version = '0.1.5-a'
const configFilename = 'config.json'
const hostname = os.hostname()
const architecture = os.arch()
const platform = os.platform()
const release = os.release()
const osname = os.type()
const osversion = os.version()
let freemem = os.freemem()
let loadavg = os.loadavg()
let page
let pi = false

console.log(
  name +
    ' v.' +
    version +
    ' (' +
    osname +
    '/' +
    architecture +
    '/' +
    osversion +
    ')',
)
console.log(platform + '/' + release)
// Check if is a Raspberry Pi
if (osname == 'Linux') {
  pi = true
  console.log('Raspberry Pi detected')
}
//Open Chromium in full screen and load initial page
let args = config.args
let executablePath = config.executablePath
if (pi) {
  args = config.argsPI
  executablePath = config.executablePathPI
}
async function start() {
  console.log('Opening browser')
  const browserconfig = {
    headless: config.headless,
    defaultViewport: config.defaultViewport,
    args: args,
    product: config.product,
    executablePath: executablePath,
  }
  console.log('browser config: ' + JSON.stringify(browserconfig))
  const browser = await puppeteer.launch(browserconfig)
  let pages = await browser.pages()
  page = pages[0]
  console.log('Loading ' + configFile.splashUrl)
  //   const page = await browser.newPage()
  await page.goto(configFile.splashUrl)
  console.log('Waiting for commands')
}

// First Time input data
let configFile = {}
try {
  var contents = fs.readFileSync(configFilename, 'utf8')
  console.log(contents)
  configFile = JSON.parse(contents)
} catch (e) {
  console.log('config.json not found. Please enter this information:')
}
if (!configFile.deviceName) {
  const company = prompt('What is the company name? (mycompanyname): ')
  if (company == '') {
    configFile.company = 'mycompanyname'
  } else {
    configFile.company = company
  }
  const name = prompt('What is the device name? (' + hostname + '): ')
  if (name == '') {
    configFile.deviceName = hostname
  } else {
    configFile.deviceName = name
  }
  const url = prompt('What is the splashUrl? (http://moodrobotics.com): ')
  if (url == '') {
    configFile.splashUrl = 'http://moodrobotics.com'
  } else {
    configFile.splashUrl = url
  }
  const host = prompt('What is the MQTT server? (mqtt://DOMAIN:1883): ')
  configFile.mqtt = { host: host }
  const info = prompt(
    'Topic info? (/' +
      configFile.company +
      '/devices/info/' +
      configFile.deviceName +
      '): ',
  )
  if (info == '') {
    configFile.mqtt.infotopic =
      '/' + configFile.company + '/devices/info/' + configFile.deviceName
  } else {
    configFile.mqtt.infotopic = info
  }
  const commands = prompt(
    'Topic commands? (/' +
      configFile.company +
      '/devices/command/' +
      configFile.deviceName +
      '): ',
  )
  if (commands == '') {
    configFile.mqtt.commandtopic =
      '/' + configFile.company + '/devices/command/' + configFile.deviceName
  } else {
    configFile.mqtt.commandtopic = commands
  }

  fs.writeFile(configFilename, JSON.stringify(configFile), (err) => {
    if (err) {
      throw err
    }
    console.log(configFilename + ' is saved.')
  })
}

// MQTT connection
if (configFile.mqtt.host) {
  var client = mqtt.connect(configFile.mqtt.host)

  client.on('connect', function () {
    client.subscribe(configFile.mqtt.commandtopic, function (err) {
      if (!err) {
        client.publish(
          configFile.mqtt.infotopic,
          'init ' + name + ' v.' + version,
        )
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
