const { KilobyteCommand } = require("../index.js");

class ProfilePictureCommand extends KilobyteCommand {
  constructor(client) {
    super(client, {
      name: "profilepicture",
      description: "Sets the bot's profile picture.",
      group: "util",
      aliases: ["pfp"],
    });
  }

  async run(message, args) {
    if (!args && message.attachments.size == 0) {
      return message.reply("I didn't see a url or an image attached.");
    }

    const attachmentUrl = message.attachments.first() && message.attachments.first().url;
    // attachment takes priority over url
    const url = attachmentUrl || args;

    this.client.user
      .setAvatar(url)
      .then(() => {
        message.reply("new profile picture set.");
      })
      .catch((error) => {
        message.reply("Sorry, I got an error trying to do that.\n" + this.client.createCodeBlock(error.toString(), "js"));
        console.log(error);
      });
  }
}

module.exports = ProfilePictureCommand;
