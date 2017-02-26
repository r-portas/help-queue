const PriorityQueueItem = require('./priorityQueueItem.js');

class Student extends PriorityQueueItem {
  constructor(name, studentNumber, priority) {
    super(priority);

    this.name = name;
    this.studentNumber = studentNumber;
  }

  getName() {
    return this.name;
  }

  getStudentNumber() {
    return this.studentNumber;
  }

  toJSON() {
    return {
      name: this.name,
      studentNumber: this.studentNumber,
      priority: this.priority
    };
  }
}

module.exports = Student;
