/**
 * The main entry point of the application
 *
 * @author Roy Portas <royportas@gmail.com>
 */

const PriorityQueue = require('./models/priorityQueue');
const Student = require('./models/student.js');

const queue = new PriorityQueue('Quick Questions');

const s1 = new Student('Bob', 100, 1);
const s2 = new Student('Alice', 101, 2);
const s3 = new Student('Jane', 102, 3);
const s4 = new Student('James', 103, 2);
const s5 = new Student('Frank', 104, 1);
const s6 = new Student('Michelle', 105, 3);

queue.print();

queue.add(s1);
queue.print();

queue.add(s3);
queue.print();

console.log('Queue contains:', queue.contains(s2));

queue.add(s2);
queue.print();

console.log('Queue contains:', queue.contains(s2));

queue.add(s4);
queue.print();

queue.add(s5);
queue.print();

queue.add(s6);
queue.print();

const item = queue.poll();
console.log('Retrieved item:', item);
queue.print();

queue.remove(s3);
queue.print();

queue.clear();
queue.print();

