import styles from "ansi-styles";

function colorizeConsole(cnsl) {
  cnsl.red = function (...args) {
    return cnsl.log(
      ...args.map((msg) => `${styles.red.open}${msg}${styles.red.close}`)
    );
  };
  cnsl.yellow = function (...args) {
    return cnsl.log(
      ...args.map((msg) => `${styles.yellow.open}${msg}${styles.yellow.close}`)
    );
  };
  cnsl.green = function (...args) {
    return cnsl.log(
      ...args.map((msg) => `${styles.green.open}${msg}${styles.green.close}`)
    );
  };

  return cnsl;
}

function main() {
  const colorizedConsole = colorizeConsole(console);

  colorizedConsole.red("I am read!", "Me too!");
  colorizedConsole.yellow("And I am yellow!");
  colorizedConsole.green("Well, I am green...");
}

main();
