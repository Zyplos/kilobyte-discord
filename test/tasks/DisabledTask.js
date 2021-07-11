const { KilobyteTask } = require("../../src");

class DisabledTask extends KilobyteTask {
  constructor(client) {
    super(client, {
      name: "Disabled by Default Task",
      description: "This task runs every second",
      cycle: 1000,
      enabled: false,
    });
  }

  task() {
    console.log("Normal cycle task ran: " + new Date().toLocaleTimeString());
  }
}

module.exports = DisabledTask;
