const { KilobyteEvent } = require("../../../src");

class ErrorLogger extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "warn",
    });
  }

  async run(warn) {
    console.warn("[Warn] ", warn);
  }
}

module.exports = ErrorLogger;
