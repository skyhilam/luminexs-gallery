import path from 'path'

export default function(moduleOptions) {

  // Register a new plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'gallery.js',
    options: moduleOptions
  });



}

// Required for Nuxt.js to recognize this as a module
module.exports.meta = require('../package.json');