const { KilobyteEvent } = require("../../../../src");

class NewMemberHandler extends KilobyteEvent {
  constructor(client) {
    super(client, {
      event: "guildMemberAdd",
    });
  }

  async run(member) {
    console.log(`[${member.guild.name}] ${member.user.tag} joined`);
  }
}

module.exports = NewMemberHandler;
