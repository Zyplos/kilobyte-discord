const { KilobyteCommand } = require("../index.js");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(duration);
dayjs.extend(relativeTime);

class Tasks extends KilobyteCommand {
  constructor(client) {
    super(client, {
      name: "taskmgr",
      description: "Internal task manager.",
      group: "util",
      details: "Only the bot owner can manage tasks.",
      guarded: true,
      ownerOnly: true,
      args: [
        {
          key: "action",
          prompt: "What should I do?",
          type: "string",
          oneOf: ["list", "enable", "disable"],
          default: "list",
        },
        {
          key: "taskName",
          prompt: "Which task?",
          type: "string",
          default: "",
        },
      ],
    });
  }

  showTaskList(message) {
    const tasks = this.client.registry.tasks;
    const embed = {
      title: "Tasks",
      description: `Enable or disable a task with **${this.client.commandPrefix}taskmgr enable/disable <taskName>**\n\n`,
      color: this.client.botColor,
    };
    for (const [taskName, task] of tasks) {
      embed.description += `${taskName} `;

      if (typeof task.cycle === "number") {
        if (task.cycle === 0) {
          embed.description += "(Manually scheduled)\n";
        } else {
          const cycleFriendly = dayjs.duration(task.cycle).format("H[hours], m[minutes], s[seconds]");
          embed.description += `(every ${cycleFriendly})\n`;
        }
      } else if (typeof task.cycle === "object") {
        const cycleFriendly = dayjs.duration(task.cycle).format("HH:mm:ss");

        embed.description += `(every day at ${cycleFriendly})\n`;
      }

      if (!task.enabled) embed.description += "└ ❌ DISABLED\n";

      if (task.lastRan) {
        const lastRan = dayjs(task.lastRan).fromNow();
        embed.description += `└ **Last ran: ${lastRan}**`;
      } else {
        embed.description += "└ **Last ran: Task has not run yet**";
      }

      embed.description += `\n└ ${task.description}\n\n`;
    }
    return message.embed(embed);
  }

  async run(message, { action, taskName }) {
    if (action === "list") {
      return this.showTaskList(message);
    }

    const task = this.client.registry.tasks.get(taskName);
    if (!task) {
      return message.reply("That task doesn't exist!");
    }

    if (action === "enable") {
      if (task.enabled) return message.reply(`The task ${taskName} is already enabled!`);
      task.enabled = true;

      task.startup();
      return message.reply(`Enabled task: ${taskName}`);
    } else if (action === "disable") {
      if (!task.enabled) return message.reply(`The task ${taskName} is already disabled!`);
      task.enabled = false;

      task.stop();
      return message.reply(`Disabled task: ${taskName}`);
    }
  }
}

module.exports = Tasks;
