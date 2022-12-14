function createConsoleWithTimestamps(cnsl) {
  const modifiedKeys = ["log", "error", "debug", "info"];

  return new Proxy(cnsl, {
    get(target, propKey, receiver) {
      if (modifiedKeys.includes(propKey)) {
        return function (...args) {
          return cnsl[propKey](new Date(), ...args);
        };
      }

      return target[propKey];
    },
  });
}

function main() {
  const consoleWithTimestamps = createConsoleWithTimestamps(console);

  consoleWithTimestamps.log("Here is a log message", 1);
  consoleWithTimestamps.debug("Here is a debug message", 2);
  consoleWithTimestamps.info("Here is an info message", 3);
  consoleWithTimestamps.error("Here is an error message", 4);

  consoleWithTimestamps.table(["1", "2", "3"]);
}

main();
