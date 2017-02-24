/**
 * Manages the queue system
 */

// TODO: Refactor names
const PriorityQueue = require('../models/priorityQueue');

class QueueController {
  constructor() {
    // Stores the queues
    this.queues = {};
  }

  /**
   * Creates a queue with the given name
   */
  createQueue(name) {
    const queue = new PriorityQueue(name);
    this.queues[queue.getName()] = queue;
  }

  /**
   * Returns an array of queue names
   */
  getQueueNames() {
    return Object.keys(this.queues);
  }

  /**
   * Checks if a student is already in a queue
   */
  studentInQueues(student) {
    const queueNames = Object.keys(this.queues);

    for (let i = 0; i < queueNames.length; i++) {
      const queueName = queueNames[i];
      if (this.queues[queueName].contains(student)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Removes the student from any queues they are in
   */
  removeStudentFromQueues(student) {
    const queueNames = Object.keys(this.queues);

    for (let i = 0; i < queueNames.length; i++) {
      const queueName = queueNames[i];
      this.queues[queueName].remove(student);
    }
  }

  /**
   * Adds a student to the queue and removing them
   * from any other queues
   */
  addStudentToQueue(student, queueName) {
    if (this.studentInQueues(student)) {
      this.removeStudentFromQueues(student);
    }

    if (Object.keys(this.queues).includes(queueName)) {
      this.queues[queueName].add(student);
    }
  }

  /**
   * Returns a readonly javascript object with all the students in queues
   */
  getQueueObject() {
    const queueObject = {};

    const queueNames = Object.keys(this.queues);

    for (let i = 0; i < queueNames.length; i++) {
      const queueName = queueNames[i];
      queueObject[queueName] = this.queues[queueName].getArray();
    }

    return queueObject;
  }

}

module.exports = QueueController;
