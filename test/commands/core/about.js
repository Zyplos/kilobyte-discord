const { KilobyteCommand } = require("../../../src");
const { version } = require("../../../package.json");

class AboutCommand extends KilobyteCommand {
  constructor(client) {
    super(client, {
      name: "about",
      group: "core",
      description: "Some stuff about me.",
      aliases: ["me"],
    });
  }

  run(message) {
    const embed = {
      title: `__About ${this.client.botName}__`,
      thumbnail: {
        url: this.client.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 512,
        }),
      },
      footer: {
        text: `v0.1 ${this.client.separator} Kilobyte v${version}`,
        icon_url: "https://i.imgur.com/hUcmRpB.png",
      },
      description: "Test Bot for kilobyte-discord, an extension of discord.js/Commando",
      color: this.client.botColor,
    };

    message.embed(embed);
  }
}

module.exports = AboutCommand;
