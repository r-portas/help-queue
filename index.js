/**
 * The main entry point of the application
 *
 * @author Roy Portas <royportas@gmail.com>
 */

const express = require('express');
const session = require('express-session');
const sharedsession = require('express-socket.io-session');
const Student = require('./models/student');
const QueueController = require('./controllers/queueController');

const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);

// Setup the queue controller
const queueController = new QueueController();
queueController.createQueue('Quick Questions');
queueController.createQueue('Long Questions');

// Setup an map of students to student numbers
// TODO: Refactor in StudentController?
let students = {};

const port = process.env.PORT || 3000;

const sess = session({
  secret: 'Super Secret Session',
  resave: true
});
app.use(sess);

app.use(express.static('public'));

/**
 * Returns the user data, used by the client
 */
app.get('/user', (req, res) => {
  // TODO: Remove testing code
  if (req.session.student == null) {
    const student = new Student(new Date().getTime(), new Date().getTime(), 1);
    req.session.student = student;

    students[student.getStudentNumber()] = student;
  }

  res.json(req.session);
});

app.get('/user/:name/:studentNumber/:priority', (req, res) => {
  const userSession = req.session;

  const student = new Student(req.params.name, req.params.studentNumber, req.params.priority);
  userSession.student = student;
  students[student.getStudentNumber()] = student;
  res.redirect('/user');
});

io.use(sharedsession(sess, {
  autoSave: true
}));

io.on('connection', (socket) => {
  console.log('User connected');

  // Tell only the new user to update
  socket.emit('update', queueController.getQueueObject());

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('removeRequest', () => {
    if (socket.handshake.session.student) {
      const studentInstance = students[socket.handshake.session.student.studentNumber];
      queueController.removeStudentFromQueues(studentInstance);

      // Notify all users of change
      io.emit('update', queueController.getQueueObject());
    }
  });

  socket.on('requestHelp', (queueName) => {
    if (socket.handshake.session.student) {
      const studentInstance = students[socket.handshake.session.student.studentNumber];
      queueController.addStudentToQueue(studentInstance, queueName);

      // Notify all users of change
      io.emit('update', queueController.getQueueObject());
    }
  });
});

http.listen(port, () => console.log(`Help queue running on port ${port}`));
