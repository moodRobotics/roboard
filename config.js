exports.args = [
  '--start-fullscreen', // you can also use '--start-fullscreen' or '--start-maximized'
  '--disable-infobars',
]
exports.argsPI = [
  '--start-fullscreen',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
]
exports.ignoreDefaultArgs = ["--enable-automation"]
exports.defaultViewport = null
exports.headless = false
exports.executablePath = ''
exports.executablePathPI = '/usr/bin/chromium-browser'
exports.product = 'chrome'
