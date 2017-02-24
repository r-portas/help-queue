
/**
 * A priority queue
 */
class PriorityQueue {

  /**
   * A queue has a name and items
   */
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  /**
   * Returns the name of the queue
   */
  getName() {
    return this.name;
  }

  /**
   * Enqueues an item
   */
  add(newItem) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (newItem.getPriority() < item.getPriority()) {
        // Add the item into the position
        this.items.splice(i, 0, newItem);
        newItem.setDate();
        return;
      }
    }

    // Else add it to the end
    this.items.push(newItem);
    newItem.setDate();
  }

  /**
   * Removes a specfic instance of an item
   */
  remove(item) {
    const studentNumber = item.getStudentNumber();

    for (let i = 0; i < this.items.length; i++) {
      if (studentNumber === this.items[i].getStudentNumber()) {
        // Remove the item
        return this.items.splice(i, 1);
      }
    }

    return null;
  }

  /**
   * Checks if an item exists in the queue
   */
  contains(item) {
    const studentNumber = item.getStudentNumber();

    for (let i = 0; i < this.items.length; i++) {
      if (studentNumber === this.items[i].getStudentNumber()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Clears the queue
   */
  clear() {
    this.items = [];
  }

  /**
   * Returns and removes the next queue item
   */
  poll() {
    return this.items.shift();
  }

  /**
   * Returns the size of the queue
   */
  size() {
    return this.items.length;
  }

  /**
   * Returns an array representation of the queue
   */
  getArray() {
    return this.items.slice();
  }

  /**
   * Prints a representation of the queue
   */
  print() {
    console.log('');
    console.log('Printing queue:', this.name);
    for (let i = 0; i < this.items.length; i++) {
      console.log(this.items[i]);
    }
  }
}

module.exports = PriorityQueue;
