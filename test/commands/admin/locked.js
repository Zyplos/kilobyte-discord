const { KilobyteCommand } = require("../../../src");

class LockedCommand extends KilobyteCommand {
  constructor(client) {
    super(client, {
      name: "lock",
      group: "admin",
      description: "This command can only be used by bot admins.",
      roleGroup: "Admins",
    });
  }

  run(message) {
    const role = this.client.registry.getInternalRoleFromMessage(message);
    const configRole = this.client.registry.roles.get(this.roleGroup);
    return message.say(
      `Ran command, you have the ${role.name} (${role.level}) role.\nThis command requires you have at least the ${configRole.name} (${configRole.level}) role.`
    );
  }
}

module.exports = LockedCommand;
