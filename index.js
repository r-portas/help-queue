/**
 * The main entry point of the application
 *
 * @author Roy Portas <royportas@gmail.com>
 */

const SSO_ENABLED = true;

const express = require('express');
const session = require('express-session');
const sharedsession = require('express-socket.io-session');
const cookieParser = require('cookie-parser');
const sso = require('uqsso');

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

if (SSO_ENABLED) {
  app.use(cookieParser());

  sso.public('^/$');
  app.use(sso);
}

/**
 * Returns the user data, used by the client
 */
app.get('/user', (req, res) => {
  if (SSO_ENABLED) {
    console.log(req.user);
  }

  res.json(req.session);
});

app.get('/user/staff/:name', (req, res) => {
  const userSession = req.session;
  userSession.staff = { name: req.params.name };
  res.redirect('/');
});

app.get('/user/:name/:studentNumber/:priority', (req, res) => {
  const userSession = req.session;

  const student = new Student(req.params.name, req.params.studentNumber, req.params.priority);
  userSession.student = student;
  students[student.getStudentNumber()] = student;
  res.redirect('/');
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

  socket.on('removeRequest', (studentNumber) => {
    if (socket.handshake.session.student) {
      const studentInstance = students[socket.handshake.session.student.studentNumber];
      queueController.removeStudentFromQueues(studentInstance);
    } else if (socket.handshake.session.staff && studentNumber != null) {
      // If the user is staff, allow them to delete any student

      const studentInstance = students[studentNumber];
      queueController.removeStudentFromQueues(studentInstance);
    }

    // Notify all users of change
    io.emit('update', queueController.getQueueObject());
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
