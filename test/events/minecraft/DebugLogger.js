const { KilobyteEvent } = require("../../../src");

class DebugLogger extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "debug",
    });
  }

  async run(message) {
    console.log("[Debug] ", message);
  }
}

module.exports = DebugLogger;
