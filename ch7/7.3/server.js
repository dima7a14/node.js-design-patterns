import http from "node:http";
import { Queue } from "./queue.js";

const tasks = new Queue(({ enqueue }) => {
  const server = http.createServer((req, res) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(chunks);
      const parsedData = JSON.parse(data.toString());
      enqueue(parsedData.task);
    });

    res.writeHead(200);
    res.end("Task added!");
  });

  server.listen(1234);
});

async function showTasks() {
  const taskFromClient = await tasks.dequeue();
  console.log(`Got a new task from client - ${taskFromClient}`);
  showTasks();
}

await showTasks();
