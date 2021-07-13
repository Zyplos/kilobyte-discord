# kilobyte-discord

Kilobyte is an extension of Discord.js's Commando framework. Extensions made are largely inspired by [AnIdiotsGuide/guidebot](https://github.com/AnIdiotsGuide/guidebot), which is what my original bots were based on. Kilobyte is meant to be a unifying codebase across my bots that incorporates Commando's ease of setup with a few of Guidebot's ideas.

## Features

Kilobyte adds the following features to Commando:

- **Role groups**: These are internal groups of users that let commands be executed only by certain users.
- **Events register**: A simple way of registering multiple event handlers.
- **Tasks**: Schedule tasks to run at a later time.
- **Guild only**: Makes it so commands are guildOnly by default.

More details can be found on [the wiki](https://github.com/Zyplos/kilobyte-discord/wiki).

An example bot using Kilobyte can be found in `/test`.
