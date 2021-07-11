class KilobyteEvent {
  constructor(client, { event }) {
    this.client = client;
    this.event = event;
  }

  async run() {
    this.client.emit("debug", "Default event handler.");
  }
}

module.exports = KilobyteEvent;
