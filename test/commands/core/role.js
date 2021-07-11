const { KilobyteCommand } = require("../../../src");

class RoleCommand extends KilobyteCommand {
  constructor(client) {
    super(client, {
      name: "role",
      group: "core",
      description: "Returns the highest role applicable to the user.",
    });
  }

  run(message) {
    const role = this.client.registry.getInternalRoleFromMessage(message);

    return message.say(`You have the ${role.name} (${role.level}) role.`);
  }
}

module.exports = RoleCommand;
