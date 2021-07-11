const { KilobyteCommand } = require("../../../src");

class MimicCommand extends KilobyteCommand {
  constructor(client) {
    super(client, {
      name: "mimic",
      group: "core",
      description: "Parrots back whatever you say.",
      args: [
        {
          key: "thingToSay",
          prompt: "What should I say?",
          type: "string",
          default: "",
        },
      ],
    });
  }

  run(message, { thingToSay }) {
    if (!thingToSay) return message.reply("hmm?");
    return message.reply(thingToSay);
  }
}

module.exports = MimicCommand;
