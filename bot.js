const settings = require("./botsettings.json");
const discord = require("discord.js");
const fs = require("fs");
const msgconditions = require("./msgconditions.js");
const helpcommand = require("./help-command.js");

const prefix = settings.prefix;

const bot = new discord.Client();
bot.commands = new Map();

fs.readdir("./commands", (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) {
    console.log("No commands found in ./commands");
    return;
  }

  jsfiles.forEach((f, i) => {
    let com = require(`./commands/${f}`);
    bot.commands.set(com.info.name, com);
  });
});

bot.on("ready", async () => {
  console.log(`Running ${bot.user.username}...`);

  // bot.generateInvite(["ADMINISTRATOR"]).then(link => {
  // 	console.log(link)
  // }).catch(err => {
  // 	console.log(err.stack)
  // })

  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch (err) {
    console.log(err.stack);
  }
});

bot.on("message", async message => {
  // CONDITIONS
  if (!msgconditions.check(message)) return;
  // END CONDITIONS

  let args = message.content.split(" ");
  let cmd = args[0];
  args = args.slice(1);

  if (!cmd.startsWith(prefix)) return;

  // Check if it's the help command
  if (cmd === `${prefix}help`) helpcommand.run(message, args, bot.commands);

  // Check if it's a modular command
  for (var [i, v] of bot.commands) {
    if (cmd === `${prefix}${v.info.command}`) {
      try {
        if (v.verify(message)) await v.run(bot, message, args);
        return;
      } catch (err) {
        console.log(err.stack);
      }
    }
  }

  //console.log(message.content)
});

bot.login(settings.token);
