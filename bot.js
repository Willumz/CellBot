const settings = require("./botsettings.json");
const discord = require("discord.js");
const fs = require("fs");

const prefix = settings.prefix;

const ConfigClass = require("./ConfigClass.js");

const msgconditions = require("./msgconditions.js");
const helpcommand = require("./help-command.js")(prefix);

const bot = new discord.Client();
bot.commands = new Map();

// Read all files from ./commands
fs.readdir("./commands", { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Iterate through files
  for (var i of files) {
    if (i.name.endsWith(".js") && i.isFile()) {
      // Get name of config file for command
      let conf = i.name.split(".");
      conf.pop();
      conf.push("json");
      conf = conf.join(".");
      // If config file exists
      if (files.map(f => f.name).indexOf(conf) > -1) {
        var config = require(`./commands/${conf}`);
        // If command enabled
        if (config.enabled === true) {
          let com = require(`./commands/${i.name}`)(
            prefix,
            new ConfigClass(`./commands/${conf}`)
          );
          com.config = config;
          bot.commands.set(com.info.name, com);
        }
      } else console.log(`Found no config file (${conf}) for ${i.name}`);
    }
    // If directory
    if (i.isDirectory()) {
      var dirname = i;
      // Read files
      fs.readdir(
        `./commands/${i.name}`,
        { withFileTypes: true },
        (err, files2) => {
          if (err) {
            console.error(err);
            return;
          }

          // Iterate through files
          for (var ii of files2) {
            if (ii.name.endsWith(".js") && ii.isFile()) {
              // Get name of config file for command
              let conf = ii.name.split(".");
              conf.pop();
              conf.push("json");
              conf = conf.join(".");
              // If config file exists
              if (files2.map(f => f.name).indexOf(conf) > -1) {
                var config = require(`./commands/${dirname.name}/${conf}`);
                // If command enabled
                if (config.enabled === true) {
                  let com = require(`./commands/${dirname.name}/${ii.name}`)(
                    prefix,
                    new ConfigClass(`./commands/${dirname.name}/${conf}`)
                  );
                  com.config = config;
                  bot.commands.set(com.info.name, com);
                }
              } else
                console.log(`Found no config file (${conf}) for ${ii.name}`);
            }
          }
        }
      );
    }
  }

  // for (var i of files)
  //   jsfiles.forEach((f, i) => {
  //     let com = require(`./commands/${f}`)(prefix);
  //     bot.commands.set(com.info.name, com);
  //   });
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
