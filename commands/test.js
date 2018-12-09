const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  message.channel.send("Test!");
};

module.exports.verify = message => {
  return true;
};

module.exports.info = {
  name: "Test Command",
  command: "test",
  usage: "!test"
};
