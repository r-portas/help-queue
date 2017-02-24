/**
 * A priority queue item
 */
class PriorityQueueItem {
  constructor(priority) {
    this.priority = priority;
  }

  getPriority() {
    return this.priority;
  }

  setPriority(priority) {
    this.priority = priority;
  }

}

module.exports = PriorityQueueItem;
