# CellBot

WARNING: The bot has not been extensively tested, and as such may be unstable.
Please also note that the UI is not currently useable, and is still heavily in development.

Contents:

- [About](#about)
- [Installation](#installation)
- [Get Started](#get-started)
- [Documentation](#documentation)


CellBot is a multipurpose bot for Discord.

## Installation

Steps:

- Install Node.js.
- Clone the repository.
- Open a command line in the root of the repo and type `npm install` to install the dependencies.
- Open `botsettings.json` and enter your Discord bot token and your desired command prefix.
- Run `run.bat` else (if on Linux or macOS) open a command line in the root of the repo and type `node bot.js`.
- On run, the bot will print an invitation link to the command line, so you can invite it to your server.
- The `{prefix}help` command lists all installed commands.


Note:

FFMPEG is required for the `music` command. If it is not installed, download the binary and add it to the PATH.
