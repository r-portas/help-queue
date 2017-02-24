/* eslint-env mocha */

const chai = require('chai');
const PriorityQueue = require('../models/priorityQueue.js');
const Student = require('../models/student.js');

const assert = chai.assert;

const students = [
  new Student('Jane', 100, 1),
  new Student('James', 101, 1),
  new Student('Derik', 102, 2),
  new Student('Chris', 104, 2),
  new Student('Kate', 105, 3),
  new Student('Karey', 106, 3),
];

let priorityQueue;

describe('Priority Queue', () => {
  beforeEach(() => {
    priorityQueue = new PriorityQueue('test queue');
  });

  it('should have correct name', () => {
    assert.equal(priorityQueue.getName(), 'test queue');
  });

  it('should start empty', () => {
    assert.equal(priorityQueue.size(), 0);
  });

  it('should return null when polling empty queue', () => {
    assert.equal(priorityQueue.poll(), null);
  });

  it('correctly add one student', () => {
    priorityQueue.add(students[0]);

    assert.equal(priorityQueue.size(), 1);

    assert.isTrue(priorityQueue.contains(students[0]));
  });

  it('correctly add two students', () => {
    priorityQueue.add(students[0]);
    priorityQueue.add(students[1]);

    assert.equal(priorityQueue.size(), 2);

    assert.isTrue(priorityQueue.contains(students[0]));
    assert.isTrue(priorityQueue.contains(students[1]));
  });

  it('maintains order with two students of same priority', () => {
    priorityQueue.add(students[0]);
    priorityQueue.add(students[1]);

    assert.equal(priorityQueue.poll().getStudentNumber(), students[0].getStudentNumber());
    assert.equal(priorityQueue.poll().getStudentNumber(), students[1].getStudentNumber());

    // Should be empty now
    assert.equal(priorityQueue.size(), 0);
  });

  it('correctly queue students with priority', () => {
    // Mix up the students
    priorityQueue.add(students[4]);
    priorityQueue.add(students[0]);
    priorityQueue.add(students[2]);

    // Should return students with lowest priority first
    assert.equal(priorityQueue.poll().getStudentNumber(), students[0].getStudentNumber());
    assert.equal(priorityQueue.poll().getStudentNumber(), students[2].getStudentNumber());
    assert.equal(priorityQueue.poll().getStudentNumber(), students[4].getStudentNumber());

    assert.equal(priorityQueue.size(), 0);
  });


  it('should be able to handle up to 1000 students', () => {
    for (let i = 0; i < 1000; i++) {
      priorityQueue.add(new Student(`Student ${i}`, i, Math.floor(Math.random() * 11)));
    }

    assert.equal(priorityQueue.size(), 1000);

    while (priorityQueue.size() > 0) {
      priorityQueue.poll();
    }

    assert.equal(priorityQueue.size(), 0);
  });

  it('correctly clears the queue', () => {
    priorityQueue.add(students[0]);
    priorityQueue.add(students[1]);

    assert.equal(priorityQueue.size(), 2);

    priorityQueue.clear();

    assert.equal(priorityQueue.size(), 0);
  });

  it('correctly removes a student', () => {
    priorityQueue.add(students[0]);
    priorityQueue.add(students[1]);

    priorityQueue.remove(students[1]);

    assert.equal(priorityQueue.size(), 1);
    assert.isTrue(priorityQueue.contains(students[0]));
    assert.isNotTrue(priorityQueue.contains(students[1]));
  });


  it('getArray() should contain the added items', () => {
    priorityQueue.add(students[0]);
    priorityQueue.add(students[1]);

    const itemArray = priorityQueue.getArray();
    assert.isTrue(itemArray.includes(students[0]));
    assert.isTrue(itemArray.includes(students[1]));
  });

  it('getArray() should return a readonly copy of the queue', () => {
    priorityQueue.add(students[0]);
    priorityQueue.add(students[1]);

    const itemArray = priorityQueue.getArray();

    itemArray.shift();

    assert.equal(itemArray.length, 1);
    assert.equal(priorityQueue.size(), 2);
  });
});
