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
const uqsso = require('uqsso');

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
  resave: true,
  saveUninitialized: true
});

app.use(sess);

io.use(sharedsession(sess, {
  autoSave: true
}));

app.use('', express.static('public'));

if (SSO_ENABLED) {
  app.use(cookieParser());

  const sso = uqsso();
  sso.public('^/$');
  app.use(sso);
}

/**
 * Returns the user data, used by the client
 */
app.get('/user', (req, res) => {
  var jsonResponse = {
    session: null,
    refresh: req.session
  };

  if (SSO_ENABLED) {
    const userSession = req.session;
    const username = req.user.name;
    const studentNumber = req.user.user;

    if (Object.keys(students).includes(studentNumber)) {
      jsonResponse.refresh = false;
      jsonResponse.session = req.session;
      res.json(jsonResponse);

    } else {
      // Create the new student
      const student = new Student(username, studentNumber, 1);
      userSession.student = student;
      students[student.getStudentNumber()] = student;

      // Update the session
      jsonResponse.session = req.session;
      jsonResponse.refresh = true;
      res.json(jsonResponse);
    }

  } else {
    res.json(jsonResponse);
  }

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

    console.log(socket.handshake.session);
    console.log('Got request');
  });
});

http.listen(port, () => console.log(`Help queue running on port ${port}`));
