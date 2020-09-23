module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", {
      "corejs": {
        "version": 3,
        "proposals": true
      }
    }]
  ]
}