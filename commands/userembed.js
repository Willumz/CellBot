const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
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

module.exports.verify = message => {
  return true;
};

module.exports.info = {
  name: "User Embed",
  command: "user",
  usage: "!user"
};
