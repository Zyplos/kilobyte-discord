const { KilobyteClient } = require("../src/index");
const path = require("path");

const prefix = "d;";
const separator = "|";

const client = new KilobyteClient({
  commandPrefix: prefix,
  owner: "204620732259368960",
  botName: "scooter",
  botColor: 0xfbb03b,
  separator: separator,
  status: {
    activity: {
      name: `Kilobyte ${separator} ${prefix}ping`,
      type: "WATCHING",
    },
    status: "dnd",
  },
});

client.registry
  .registerEventsIn(path.join(__dirname, "events"))
  .registerDefaultTypes()
  .registerGroups([
    ["core", "Core"],
    ["admin", "Bot Management Commands"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerDefaultKilobyteCommands()
  .registerInternalRoleGroups(["elevated", "trusted"])
  .addUserIdsToInternalRoleGroup("elevated", [
    "235088799074484224", // rythm
    "155149108183695360", // dyno
    "159985870458322944", // mee6
  ])
  .addUserIdsToInternalRoleGroup("trusted", [
    "439205512425504771", // notsobot
  ])
  .registerInternalRoles([
    {
      level: 4,
      name: "Server Owner",
      check: (message) => (message.channel.type === "text" ? (message.guild.owner.user.id === message.author.id ? true : false) : false),
    },
    {
      level: 7,
      name: "Mods",
      check: "elevated",
    },

    {
      level: 8,
      name: "Admins",
      check: "trusted",
    },

    {
      level: 9,
      name: "this one dude",
      check: (message) => "290969346577137676" === message.author.id,
    },

    {
      level: 10,
      name: "me",
      check: (message) => client.isOwner(message.author),
    },
  ])
  .registerTasksIn(path.join(__dirname, "tasks"))
  .registerCommandsIn(path.join(__dirname, "commands"));

client.login(process.env.BOT_TOKEN);
