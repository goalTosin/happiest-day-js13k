const path = require('path');

module.exports = {
  // The main file of your application
  entry: './index.js', 
  output: {
    // The name of the single compiled file
    filename: 'bundle.js',
    // The absolute path to the output directory
    path: path.resolve(__dirname, 'build'),
    // library: {
    //   name: 'chess', // Global fallback variable name
    //   type: 'umd',             // Universal Module Definition (Works everywhere)
    // },
    
    // globalObject: 'this',      // Prevents "window is not defined" errors in Node environments
    clean: true,               // Wipes old builds before compiling
  
  },
  // Use 'production' for minified code or 'development' for readable code
  mode: 'production', 
};