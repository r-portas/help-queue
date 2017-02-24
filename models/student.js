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
}

module.exports = Student;
