const { KilobyteEvent } = require("../../../src");

class ErrorLogger extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "error",
    });
  }

  async run(error) {
    console.error("[Error]", error);
  }
}

module.exports = ErrorLogger;
