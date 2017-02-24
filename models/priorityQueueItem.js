/**
 * A priority queue item
 */
class PriorityQueueItem {
  constructor(priority) {
    this.priority = priority;

    // The time the student was added into the queue
    this.date = null;
  }

  getPriority() {
    return this.priority;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  /**
   * Returns the date
   */
  getDate() {
    return this.date;
  }

  /**
   * Sets the date the student was added into the queue
   *
   * Defaultly sets it to current time if no time was provided
   */
  setDate(date = null) {
    if (date) {
      this.date = date;
    } else {
      this.date = new Date();
    }
  }
}

module.exports = PriorityQueueItem;
