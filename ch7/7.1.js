class ColorConsole {
  log(msg) {
    console.log(msg);
  }
}

class RedConsole extends ColorConsole {
  log(msg) {
    console.log("\x1b[31m%s\x1b[0m", msg);
  }
}

class GreenConsole extends ColorConsole {
  log(msg) {
    console.log("\x1b[32m%s\x1b[0m", msg);
  }
}

class BlueConsole extends ColorConsole {
  log(msg) {
    console.log("\x1b[34m%s\x1b[0m", msg);
  }
}

function createConsole(color) {
  switch (color) {
    case "red":
      return new RedConsole();
    case "blue":
      return new BlueConsole();
    case "green":
      return new GreenConsole();
    default:
      return new ColorConsole();
  }
}

function main() {
  const colorConsole = createConsole(process.argv[2]);

  colorConsole.log("This message should be with color!");
}

main();
