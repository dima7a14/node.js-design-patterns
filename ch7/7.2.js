import http from "node:http";

class HTTPBuilder {
  constructor() {
    this.method = "GET";
    this.hostname = "";
    this.path = "";
    this.query = "";
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  setURL(url) {
    const index = url.indexOf("/");
    if (index === -1) {
      this.hostname = url;
    } else {
      this.hostname = url.slice(0, index);
      this.path = url.slice(index);
    }
    return this;
  }

  setQuery(query) {
    this.query = query;
    return this;
  }

  invoke() {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          method: this.method,
          hostname: this.hostname,
          path: `${this.path}${this.query}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (res) => {
          console.log(`STATUS: ${res.statusCode}`);
          res.setEncoding("utf-8");
          res.on("data", (chunk) => {
            console.log(`BODY: ${chunk}`);
          });
          res.on("end", () => {
            console.log("No more data in response");
            resolve();
          });
        }
      );

      req.on("error", (err) => {
        console.error(`Problem with request: ${err}`);
        reject(err);
      });

      req.end();
    });
  }
}

function main() {
  const request = new HTTPBuilder()
    .setMethod("GET")
    .setURL("www.google.com/search")
    .setQuery("?q=my+query");

  request.invoke().then(() => {
    console.log("Successful");
  });
}

main();
