const { KilobyteTask } = require("../../src");

class ManualTask extends KilobyteTask {
  constructor(client) {
    super(client, {
      name: "Manually Scheduled Task",
      description: "This task runs when you program it to.",
      cycle: 0,
    });
  }

  task() {
    console.log("Manual task ran.");
    // this.scheduleTask(1000); // this will run the task again in 1 second
  }
}

module.exports = ManualTask;
