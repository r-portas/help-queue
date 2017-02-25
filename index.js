/**
 * The main entry point of the application
 *
 * @author Roy Portas <royportas@gmail.com>
 */

const express = require('express');
const session = require('express-session');
const sharedsession = require('express-socket.io-session');

const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

const sess = session({
  secret: 'Super Secret Session',
  resave: true,
  saveUnitialized: true
});
app.use(sess);

app.use(express.static('public'));

/**
 * Returns the user data, used by the client
 */
app.get('/user', (req, res) => {
  res.json(req.session);
});

app.get('/user/:username', (req, res) => {
  const userSession = req.session;
  userSession.username = req.params.username;
  res.send(200);
});

io.use(sharedsession(sess, {
  autoSave: true
}));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('requestHelp', () => {
    console.log(`${socket.handshake.session.username} requested help`);
  });
});

http.listen(port, () => console.log(`Help queue running on port ${port}`));
