const { KilobyteEvent } = require("../../src");

class HatHandler extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "message",
    });
  }

  async run(message) {
    if (message.content.startsWith("h#")) {
      const hatContent = message.content.substring(2);

      console.log("Hat handler ran!", hatContent);
    }
  }
}

module.exports = HatHandler;
