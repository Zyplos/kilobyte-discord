class KilobyteTask {
  constructor(client, { name = "Untitled Task", description = "No description provided.", cycle = 1000 * 5, enabled = true }) {
    this.client = client;
    this.name = name;
    this.description = description;
    this.cycle = cycle;
    this.enabled = enabled;
    this.intervalId = null;
    this.lastRan = null;
  }

  // Sets up task to run
  async startup() {
    const taskName = this.name;
    if (!this.enabled) {
      return this.client.emit("warn", `${taskName} is disabled and will not run.`);
    }

    if (this.init) {
      await this.init();
    }

    if (typeof this.cycle === "number") {
      const thisRef = this;
      // manual tasks will run once
      if (thisRef.cycle === 0) {
        this.client.emit("debug", `${taskName} is a manual task.`);
        thisRef.run();
      } else {
        this.client.emit("debug", `${taskName} is a cycled task.`);
        thisRef.run();

        // tasks with a cycle will run every X milliseconds
        thisRef.intervalId = setInterval(() => {
          thisRef.run();
        }, thisRef.cycle);
      }
    } else if (typeof this.cycle === "object") {
      this.client.emit("debug", `${taskName} is a timed task.`);
      // timed tasks shouldn't run right away, istead, they should wait until the time is reached
      const { hours, minutes, seconds } = this.cycle;
      if (typeof hours !== "number" || typeof minutes !== "number" || typeof seconds !== "number") {
        throw new TypeError("Task.Cycle must be an object with hours, minutes, and seconds number properties.");
      }
      const calcTime = this._calculateTargetTimestamp(hours, minutes, seconds);
      this.scheduleTask(calcTime.getTime(), true);
    } else {
      throw new TypeError("Task.cycle must be a number or an object.");
    }
  }

  // Stops task from running
  async stop() {
    if (this.shutdown) {
      await this.shutdown();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.enabled = false;
  }

  run() {
    // reschedule first, then run task
    // this will allow manually scheduled tasks to be correctly rescheduled
    this.finish();
    this.task();
  }

  task() {
    this.client.emit("warn", `Task ${this.name} seems misconfigured. task() must be defined in your file.`);
  }

  finish() {
    // Task cycles that are numbers will always have an intervalId set since they're created with setInterval
    // Everything else is rescheduled with scheduleTask which expects this.intervalId to be null

    // if (task manually scheduled) OR (task is set to run at a certain time) then reschedule depeonds on scheduleTask
    if ((typeof this.cycle === "number" && this.cycle === 0) || typeof this.cycle === "object") {
      this.intervalId = null;
    }

    // timed tasks should be rescheduled
    if (typeof this.cycle === "object") {
      const { hours, minutes, seconds } = this.cycle;
      const calcTime = this._calculateTargetTimestamp(hours, minutes, seconds);
      this.scheduleTask(calcTime.getTime(), true);
    }
    this.lastRan = new Date();
  }

  _calculateTargetTimestamp(hours, minutes, seconds) {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);

    targetDate.setHours(hours);
    targetDate.setMinutes(minutes);
    targetDate.setSeconds(seconds);

    if (currentDate < targetDate) {
      // its before the target time
      return targetDate;
    }

    // its after the target time, schedule for tomorrow
    targetDate.setDate(targetDate.getDate() + 1);
    return targetDate;
  }

  scheduleTask(inXMilliseconds, targetTimestamp = false) {
    if (this.intervalId) {
      this.client.emit("error", "Could not reschedule task: ", this.name, ". This task is already scheduled.");
      return false;
    }
    this.client.emit("debug", "Scheduling task: " + this.name);
    let intervalCycle = inXMilliseconds;
    if (targetTimestamp) intervalCycle -= Date.now();

    this.intervalId = setTimeout(() => {
      this.run();
    }, intervalCycle);
    return true;
  }
}
module.exports = KilobyteTask;
