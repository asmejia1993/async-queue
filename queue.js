const EventEmitter = require('events');

class AsyncQueue extends EventEmitter {
  constructor() {
    super();
    this.items = [];
    this.intervalId = null;
    this.interval = 250;
  }

  enqueue(item) {
    this.items.push(item);
    this.emit('enqueued', item);
  }

  getCurrentInterval() {
    return this.interval;
  }

  peek() {
    return this.items[0];
  }

  print() {
    return this.items.slice(); // Return a copy for testing
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        if (this.items.length > 0) {
          const item = this.items.shift();
          this.emit('dequeued', item);
        }
      }, this.interval);
    }
  }

  emit(event, data) {
    if (event === 'interval') {
      this.interval = data;
      if (this.intervalId) {
        this.pause();
        this.start();
      }
    }
    super.emit(event, data);
  }

  pause() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  on(event, listener) {
    super.on(event, listener);
    console.log(event);
    if (event === 'interval') {
      this.interval = listener;
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.start();
      }
    }
  }
}

module.exports = AsyncQueue;
