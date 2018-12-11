const discord = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = function(prefix, config) {
  var exports = {};

  exports.conns = {};
  exports.dispatchers = {};
  exports.streamOptions = { seek: 0, volume: 1 };

  exports.run = async (bot, message, args) => {
    var conns = exports.conns;
    var dispatchers = exports.dispatchers;
    var streamOptions = exports.streamOptions;

    var voiceChannel = message.member.voiceChannel;

    if (voiceChannel == null) {
      message.channel.send(
        `<@${message.author.id}> is not in a voice channel.`
      );
      return;
    }

    if (args[0] === "add") {
      // ADD TRACK
      if (args[1] != null) {
        var url = args[1];
        if (conns[voiceChannel] != null) {
          conns[voiceChannel].push(url);
          message.channel.send(
            `<@${
              message.author.id
            }>, Added to queue! View the queue with '${prefix}music list'.`
          );
        } else {
          conns[voiceChannel] = [url];

          // NEW STREAM
          voiceChannel
            .join()
            .then(connection => {
              console.log("joined channel");
              playMusic(
                conns[voiceChannel][0],
                voiceChannel,
                connection,
                conns,
                dispatchers,
                streamOptions
              );
            })
            .catch(err => console.log(err));
          //END NEW STREAM
          message.channel.send(
            `<@${
              message.author.id
            }>, Added to queue! View the queue with '${prefix}music list'.`
          );
        }
      } else {
        message.channel.send(`<@${message.author.id}>, please specify a URL.`);
      }
    } else if (args[0] === "pause") {
      // PAUSE
      dispatchers[voiceChannel].pause();
      message.channel.send(`<@${message.author.id}>, Paused!`);
    } else if (args[0] === "play") {
      // PLAY
      dispatchers[voiceChannel].resume();
      message.channel.send(`<@${message.author.id}>, Resumed!`);
    } else if (args[0] === "skip") {
      // SKIP
      dispatchers[voiceChannel].end();
      message.channel.send(`<@${message.author.id}>, Skipped!`);
    } else if (args[0] === "list") {
      async function list() {
        var titles = `<@${message.author.id}>,\n`;
        var msg = await message.channel.send(`Loading music list...`);
        for (var i = 0; i < conns[voiceChannel].length; i++) {
          const info = await ytdl.getInfo(conns[voiceChannel][i]);
          titles += `${i + 1}. ${info.title} by ${info.author.name}\n`;
        }
        msg.edit(titles);
      }
      list();
    }
  };

  async function playMusic(
    url,
    voiceChannel,
    connection,
    conns,
    dispatchers,
    streamOptions
  ) {
    var stream = ytdl(conns[voiceChannel][0], {
      filter: "audioonly"
    });
    dispatchers[voiceChannel] = connection.playStream(stream, streamOptions);
    dispatchers[voiceChannel].on("end", end => {
      conns[voiceChannel].shift();
      console.log(conns[voiceChannel]);
      if (conns[voiceChannel].length != 0)
        playMusic(
          conns[voiceChannel][0],
          voiceChannel,
          connection,
          conns,
          dispatchers,
          streamOptions
        );
      else {
        voiceChannel.leave();
        console.log("left channel");
        delete conns[voiceChannel];
      }
    });
  }

  exports.verify = message => {
    return true;
  };

  exports.info = {
    name: "Play Music From YouTube",
    command: "music",
    usage: `${prefix}music {option} {params...}
  
  Options:
  - ${prefix}music add {url}
    Adds the song located at the URL specified to the song queue.
  - ${prefix}music list
    Lists all the songs currently in the queue.
  - ${prefix}music skip
    Skips the currently playing track.
  - ${prefix}music pause
    Pauses playback.
  - ${prefix}music play
    Resumes playback.`
  };

  return exports;
};
