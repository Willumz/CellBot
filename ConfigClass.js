const fs = require("fs");

class Config {
  constructor(path) {
    this.path = path;
  }

  GetProperty(property) {
    return require(this.path)[property];
  }

  SetProperty(property, value) {
    var config = require(this.path);
    config[property] = value;
    var json = JSON.stringify(config);
    fs.writeFile(this.path, json, err => {
      if (err) console.log(err);
    });
  }
}

module.exports = Config;
