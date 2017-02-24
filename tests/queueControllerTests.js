/* eslint-env mocha */

const chai = require('chai');
const QueueController = require('../controllers/queueController');
const Student = require('../models/student');

const assert = chai.assert;

let queueController;

const students = [
  new Student('Jane', 100, 1),
  new Student('James', 101, 1),
  new Student('Derik', 102, 2),
  new Student('Chris', 104, 2),
  new Student('Kate', 105, 3),
  new Student('Karey', 106, 3),
];

describe('Queue Controller', () => {
  beforeEach(() => {
    queueController = new QueueController();
    queueController.createQueue('quick');
    queueController.createQueue('long');
  });

  it('should have correct queues', () => {
    const queueNames = queueController.getQueueNames();

    assert.isTrue(queueNames.includes('quick'));
    assert.isTrue(queueNames.includes('long'));
    assert.equal(queueNames.length, 2);
  });

  it('student added to queue correctly', () => {
    queueController.addStudentToQueue(students[0], 'quick');
    assert.isTrue(queueController.studentInQueues(students[0]));
  });

  it('student should not be added to non existent queue', () => {
    queueController.addStudentToQueue(students[0], 'not_a_queue');
    assert.isNotTrue(queueController.studentInQueues(students[0]));
  });

  it('should remove student from queue', () => {
    queueController.addStudentToQueue(students[0], 'quick');
    assert.isTrue(queueController.studentInQueues(students[0]));

    queueController.removeStudentFromQueues(students[0]);
    assert.isNotTrue(queueController.studentInQueues(students[0]));
  });

  it('should return a queue object containing students', () => {
    queueController.addStudentToQueue(students[0], 'quick');
    queueController.addStudentToQueue(students[1], 'long');
    queueController.addStudentToQueue(students[2], 'long');

    const queueObj = queueController.getQueueObject();

    const longQueue = queueObj.long;
    const quickQueue = queueObj.quick;

    assert.equal(longQueue.length, 2);
    assert.equal(quickQueue.length, 1);
  });
});
