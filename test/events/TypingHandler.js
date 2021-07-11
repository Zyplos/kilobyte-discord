const { KilobyteEvent } = require("../../src");

class TypingHandler extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "typingStart",
    });
  }

  async run(channel, user) {
    console.log(`[${channel.guild.name} - ${channel.name}] ${user.tag} started typing`);
  }
}

module.exports = TypingHandler;
