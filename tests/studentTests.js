/* eslint-env mocha */

const chai = require('chai');
const Student = require('../models/student.js');

const assert = chai.assert;

let student;

describe('Student', () => {
  beforeEach(() => {
    student = new Student('Jane', 1234, 1);
  });

  it('should have correct name', () => {
    assert.equal(student.getName(), 'Jane');
  });

  it('should have correct student number', () => {
    assert.equal(student.getStudentNumber(), 1234);
  });

  it('should have correct priority', () => {
    assert.equal(student.getPriority(), 1);
  });

  it('should set correct priority', () => {
    student.setPriority(2);
    assert.equal(student.getPriority(), 2);
  });
});
