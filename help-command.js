const discord = require("discord.js");

module.exports.run = async (message, args, commands) => {
  if (args.length > 0) {
    var found = false;
    for (var [i, v] of commands) {
      if (v.info.command === args[0]) {
        message.channel.send(
          `<@${message.author.id}>,\nUsage for ${v.info.command}:\n${
            v.info.usage
          }`
        );
        found = true;
      }
    }
    if (!found)
      message.channel.send(
        `<@${message.author.id}>, that command does not exist.`
      );
  } else {
    var helptext = `<@${
      message.author.id
    }>,\nThe following is a list of all the commands installed.\nFor usage instructions for each command, use !help {command without prefix}\n`;

    for (var [i, v] of commands) {
      helptext += `\n- !${v.info.command}`;
    }
    message.channel.send(helptext);
  }
};
