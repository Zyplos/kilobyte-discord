const { KilobyteTask } = require("../../../src");

class AReminder extends KilobyteTask {
  constructor(client) {
    super(client, {
      name: "Timed Reminder",
      description: "This will fire everyday at 5:35am",
      cycle: {
        hours: 5,
        minutes: 35,
        seconds: 0,
      },
    });
  }

  task() {
    if (this.lastRan) {
      this.client.users.cache.get("204620732259368960").send("go to bed");
    }
  }
}

module.exports = AReminder;
