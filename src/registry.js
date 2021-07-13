const { Collection } = require("discord.js");
const { CommandoRegistry } = require("discord.js-commando");

class KilobyteRegistry extends CommandoRegistry {
  constructor(client) {
    super(client);

    this.roles = new Collection();
    this.roleGroups = new Collection();
    this.tasks = new Collection();

    // default role
    this.registerInternalRole({
      level: 0,
      name: "user",
      check() {
        return true;
      },
    });
  }

  // Register an internal role
  registerInternalRole(role) {
    if (typeof role.level !== "number") throw new TypeError("Role level must be a number.");
    if (typeof role.name !== "string") throw new TypeError("Role name must be a string.");
    if (typeof role.check !== "function" && typeof role.check !== "string") throw new TypeError("Role check must be a function or RoleGroup.");

    // convert string into a function that checks if the string is a roleGroupKey
    // which returns true if the ID exists in the roleGroup
    if (typeof role.check === "string") {
      const roleGroupRef = this.roleGroups;
      const roleGroupKey = role.check;
      if (!this.roleGroups.has(roleGroupKey)) throw new ReferenceError(`Could not register role, RoleGroup ${roleGroupKey} does not exist.`);

      role.check = function check(message) {
        return roleGroupRef.get(roleGroupKey).includes(message.author.id);
      };
    }

    this.roles.set(role.name, role);
    this.roles.sort((userA, userB) => userB.level - userA.level);
    return this;
  }

  // Takes an array of roles to register using registerInternalRole
  registerInternalRoles(roles) {
    if (!Array.isArray(roles)) throw new TypeError("Roles must be an Array.");

    roles.forEach((role) => {
      this.registerInternalRole(role);
    });
    return this;
  }

  // Registers a role group, an array of user ids stored by key that can be referenced in a role group
  registerInternalRoleGroup(roleGroupKey) {
    if (typeof roleGroupKey !== "string") throw new TypeError("RoleGroup must be a string.");

    this.roleGroups.set(roleGroupKey, []);
    return this;
  }

  // Takes an array of roleGroups to register using registerInternalRoleGroup
  registerInternalRoleGroups(roleGroupKeys) {
    if (!Array.isArray(roleGroupKeys)) throw new TypeError("RoleGroups must be an Array.");

    roleGroupKeys.forEach((roleGroupKey) => {
      this.registerInternalRoleGroup(roleGroupKey);
    });
    return this;
  }

  // adds a user id to a given role group
  addUserIdToInternalRoleGroup(key, id) {
    if (!this.roleGroups.has(key)) throw new ReferenceError(`RoleGroup ${key} does not exist.`);

    this.roleGroups.get(key).push(id);
    return this;
  }

  // takes an array of user ids to add to a role group
  addUserIdsToInternalRoleGroup(keys, ids) {
    if (!this.roleGroups.has(keys)) throw new ReferenceError(`RoleGroup ${keys} does not exist.`);

    for (const id of ids) {
      this.roleGroups.get(keys).push(id);
    }
    return this;
  }

  // returns the user's level given a message
  getInternalRoleFromMessage(message) {
    for (const role of this.roles.values()) {
      if (role.check(message)) return role;
    }
  }

  //https://stackoverflow.com/a/55251598
  _flattenObject(obj) {
    const flattened = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(flattened, this._flattenObject(obj[key]));
      } else {
        flattened[key] = obj[key];
      }
    });

    return flattened;
  }

  // Register an event to the client
  registerEvent(eventFunction) {
    eventFunction = new eventFunction(this.client);
    if (typeof eventFunction.event !== "string") throw new TypeError("Event type must be a string.");

    this.client.on(eventFunction.event, (...args) => eventFunction.run(...args));
    this.client.emit("Registered event: " + eventFunction);
    return this;
  }

  // Register an array of given events
  registerEvents(events) {
    if (!Array.isArray(events)) throw new TypeError("Events must be an Array.");

    events.forEach((event) => {
      this.registerEvent(event);
    });
    return this;
  }

  // Require all files in a directory and loop through them
  registerEventsIn(options) {
    const obj = require("require-all")(options);
    const events = Object.values(this._flattenObject(obj));

    this.registerEvents(events);
    return this;
  }

  // Register a task
  registerTask(taskFunction) {
    const registryRef = this;
    this.client.once("ready", async () => {
      try {
        const task = new taskFunction(registryRef.client);
        const taskName = task.name;
        this.client.emit("debug", `Loading Task: ${taskName}.`);
        registryRef.tasks.set(taskName, task);

        task.startup();
      } catch (e) {
        this.client.emit("error", `Unable to load command ${taskFunction}:`, e);
      }
    });
    return this;
  }

  // Register an array of given tasks
  registerTasks(tasks) {
    if (!Array.isArray(tasks)) throw new TypeError("Tasks must be an Array.");

    tasks.forEach((task) => {
      this.registerTask(task);
    });
    return this;
  }

  // Register a tasks in a directory
  registerTasksIn(options) {
    const obj = require("require-all")(options);
    const tasks = Object.values(this._flattenObject(obj));

    this.registerTasks(tasks);
    return this;
  }

  // Register Kilobyte's default commands
  registerDefaultKilobyteCommands() {
    this.registerCommand(require("./default-commands/taskmgr"));
    this.registerCommand(require("./default-commands/pfp"));
    return this;
  }
}

module.exports = KilobyteRegistry;
