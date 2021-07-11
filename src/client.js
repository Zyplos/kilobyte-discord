const { CommandoClient, CommandDispatcher } = require("discord.js-commando");
const KilobyteRegistry = require("./registry");

class KilobyteClient extends CommandoClient {
  constructor({ botName, botColor, separator, status, commandsGuildOnly, ...options }) {
    super(options);
    this.botName = botName;
    this.botColor = botColor;
    this.separator = separator;
    this.commandsGuildOnly = commandsGuildOnly;

    if (status) {
      const clientRef = this;
      clientRef.once("ready", () => {
        clientRef.user.setPresence(status);
      });
    }

    this.registry = new KilobyteRegistry(this);
    // KilobyteClient client won't work if a new dispatcher with our custom rsgistry isn't redefined
    this.dispatcher = new CommandDispatcher(this, this.registry);

    // Add custom inhibitor that prevents commands with internal role requirements from being run
    this.dispatcher.addInhibitor((msg) => {
      // commando's unknown commands handler will break if this isn't here
      // commando's default commands, which don't have roleGroups defined, handles their own permission requirements
      // so setting a global user default should be fine
      if (typeof msg.command.roleGroup === "undefined") msg.command.roleGroup = "user";

      const userRole = this.registry.getInternalRoleFromMessage(msg);
      const commandRole = this.registry.roles.get(msg.command.roleGroup);

      if (!commandRole) {
        return {
          reason: "INTERNAL_ROLE_DOES_NOT_EXIST",
          response: msg.say(`
                    This command is misconfigured and could not be run: \`roleGroup\` is set to something that does not exist.\nPlease contact the bot owner about this error.`),
        };
      }

      // Check if role level is less than command's role level
      if (userRole.level < commandRole.level) {
        return {
          reason: "INTERNAL_ROLE_NOT_MET",
          response: msg.say(`(${userRole.level} < ${commandRole.level}) This command can only be run by certain users.`),
        };
      }
    });
  }
}

module.exports = KilobyteClient;
