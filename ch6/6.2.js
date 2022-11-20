import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { parse } from "csv-parse";

// Record interface
// {
//   lsoa_code: 'E01002156',
//   borough: 'Harrow',
//   major_category: 'Violence Against the Person',
//   minor_category: 'Harassment',
//   value: '0',
//   year: '2009',
//   month: '6'
// }

const csvParser = parse({ columns: true });
const dataStream = createReadStream("./london_crime_by_lsoa.csv").pipe(
  csvParser
);

/** Did the number of crimes go up or down over the years? */
class CrimesDynamic extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.values = new Map();
  }

  _transform(record, enc, cb) {
    const key = Number(record.year);
    const prevValue = this.values.get(key) ?? 0;
    this.values.set(key, prevValue + Number(record.value));
    cb();
  }

  _flush(cb) {
    const years = Array.from(this.values.keys());
    years.sort();
    let diff = 0;
    let prevValue = 0;

    for (const year of years) {
      diff = this.values.get(year) - prevValue;
      prevValue = this.values.get(year);
    }

    this.push(
      `The number of crimes goes ${
        diff > 0 ? "up" : "down"
      } over the years.\n\n`
    );
    cb();
  }
}

dataStream.pipe(new CrimesDynamic()).pipe(process.stdout);

/** What are the most dangerous ares of London? */
class MostDangerousBoroughs extends Transform {
  constructor(boroughs_count, options = {}) {
    options.objectMode = true;
    super(options);
    this.count = boroughs_count;
    this.boroughs = new Map();
  }

  _transform(record, enc, cb) {
    const prevValue = this.boroughs.get(record.borough) ?? 0;
    this.boroughs.set(record.borough, prevValue + Number(record.value));
    cb();
  }

  _flush(cb) {
    const values = Array.from(this.boroughs);

    values.sort((a, b) => a[1] - b[1]);

    const mostDangerous = values.slice(0, this.count).map((value) => value[0]);

    this.push(`The most dangerous areas are: ${mostDangerous.join(", ")}\n\n`);
    cb();
  }
}

dataStream.pipe(new MostDangerousBoroughs(3)).pipe(process.stdout);

/** What is the most common crime per area? */
class MostCommonCrimePerBorough extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.crimes = new Map();
  }

  _transform(record, enc, cb) {
    const borough = record.borough;
    const crime = record.minor_category;
    const value = Number(record.value);
    const boroughCrimes = this.crimes.get(borough) ?? new Map();
    const prevValue = boroughCrimes.get(crime) ?? 0;

    boroughCrimes.set(crime, prevValue + value);
    this.crimes.set(borough, boroughCrimes);
    cb();
  }

  _flush(cb) {
    const mostCommonCrimes = [];

    for (const [borough, crimes] of this.crimes.entries()) {
      const boroughCrimes = Array.from(crimes);

      boroughCrimes.sort((a, b) => b[1] - a[1]);

      console.log("boroughCrimes", borough, boroughCrimes);

      mostCommonCrimes.push(`${borough} - ${boroughCrimes[0][0] ?? null}`);
    }

    this.push(
      `Most common crime per borough:\n${mostCommonCrimes.join("\n")}\n\n`
    );
    cb();
  }
}

dataStream.pipe(new MostCommonCrimePerBorough()).pipe(process.stdout);

/** What is the least common crime? */
class LeastCommonCrime extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.crimes = new Map();
  }

  _transform(record, enc, cb) {
    const category = record.major_category;
    const prevValue = this.crimes.get(category) ?? 0;

    this.crimes.set(category, prevValue + Number(record.value));

    cb();
  }

  _flush(cb) {
    const values = Array.from(this.crimes);

    values.sort((a, b) => a[1] - b[1]);

    this.push(
      `The least common crime is ${values[0][0]} (${values[0][1]}).\n\n`
    );
    cb();
  }
}

dataStream.pipe(new LeastCommonCrime()).pipe(process.stdout);
