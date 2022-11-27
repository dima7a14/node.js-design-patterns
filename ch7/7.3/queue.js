export class Queue {
  #queue = [];
  #awaitResolve = null;

  constructor(executor) {
    executor({ enqueue: this.#enqueue.bind(this) });
  }

  #enqueue(value) {
    return new Promise((resolve) => {
      if (this.#awaitResolve !== null) {
        this.#awaitResolve(value);
      } else {
        this.#queue.push(value);
      }

      resolve();
    });
  }

  dequeue() {
    return new Promise((resolve) => {
      if (this.#queue.length > 0) {
        resolve(this.#queue.pop());
        return;
      }

      this.#awaitResolve = resolve;
    });
  }
}
