module.exports.check = message => {
  // If sender bot, return.
  if (message.author.bot) return false;

  // If the message was in a DM, return.
  if (message.channel.type === "dm") return false;

  // All's good.
  return true;
};
