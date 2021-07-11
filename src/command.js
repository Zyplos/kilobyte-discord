const { Command } = require("discord.js-commando");

// sets guildOnly as a default for all commands
// makes memberName the same as name unless specified
// adds roleGroup functionality
class KilobyteCommand extends Command {
  constructor(client, { name, memberName, guildOnly, roleGroup = "user", ...args }) {
    super(client, {
      name,
      memberName: memberName || name,
      guildOnly: guildOnly || client.commandsGuildOnly,
      ...args,
    });

    this.roleGroup = roleGroup;
  }
}
module.exports = KilobyteCommand;
