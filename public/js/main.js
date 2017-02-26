/**
 * The main vue instance
 * @author Roy Portas <royportas@gmail.com>
 */

var app = new Vue({
  el: '#app',

  data: function() {
    return {
      socket: null,
      user: null,
      queues: {}
    };
  },

  methods: {
    /**
     * Gets the user information
     */
    getUser() {
      var request = new XMLHttpRequest();

      var scope = this;
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
          if (request.status == 200) {
            scope.user = JSON.parse(request.responseText);
          }
        }
      };

      request.open('GET', '/user');
      request.send();
    },

    /**
     * Request help for the given queue name
     */
    requestHelp(queueName) {
      this.socket.emit('requestHelp', queueName);
    },

    /**
     * Removes the help request
     */
    removeRequest() {
      this.socket.emit('removeRequest');
    },

    /**
     * Checks if the student made the request
     */
    isMyRequest(request) {
      if (this.user.student) {
        if (request.studentNumber == this.user.student.studentNumber) {
          console.log('Does belong');
          return true;
        }
      }

      return false;
    }
  },

  computed: {
    name() {

      if (this.user) {
        if (this.user.student) {
          return this.user.student.name;
        } else {
          return 'Not logged in';
        }
      }
    }
  },

  mounted: function() {
    this.getUser();

    this.socket = io();

    var scope = this;
    this.socket.on('update', function(data) {
      scope.queues = data;
    });

  }
});
