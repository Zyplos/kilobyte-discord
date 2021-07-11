module.exports = {
  KilobyteClient: require("./client"),
  KilobyteCommand: require("./command"),
  KilobyteEvent: require("./event"),
  KilobyteRegistry: require("./registry"),
  KilobyteTask: require("./task"),

  version: require("../package.json").version,
};
