const { KilobyteEvent } = require("../../src");

class ClientReady extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "ready",
    });
  }

  async run() {
    console.log("Ready handler called. Client's ready!");
  }
}

module.exports = ClientReady;
