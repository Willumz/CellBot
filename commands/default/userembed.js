const discord = require("discord.js");

module.exports = function(prefix, config) {
  var exports = {};
  exports.run = async (bot, message, args) => {
    let embed = new discord.RichEmbed()
      .setAuthor(message.author.username)
      .setDescription("This is the user's info.")
      .setColor("#FFFFFF")
      .addField(
        "Full Username",
        `${message.author.username}#${message.author.discriminator}`
      )
      .addField("ID", message.author.id)
      .addField("Created At", message.author.createdAt);
    message.channel.send({ embed: embed });
  };

  exports.verify = message => {
    return true;
  };

  exports.info = {
    name: "User Embed",
    command: "user",
    usage: `${prefix}user`
  };

  return exports;
};
