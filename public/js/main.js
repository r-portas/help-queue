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
      this.showSnackbar('Request submitted');
    },

    /**
     * Removes the help request
     */
    removeRequest(studentNumber = null) {
      this.socket.emit('removeRequest', studentNumber);
      this.showSnackbar('Request cancelled');
    },

    /**
     * Checks if the student made the request
     */
    isMyRequest(request) {
      if (this.user.student) {
        if (request.studentNumber == this.user.student.studentNumber) {
          return true;
        }
      } else if (this.user.staff) {
        return true;
      }

      return false;
    },

    /**
     * Shows a notification through the snackbar
     */
    showSnackbar(message) {
      var sb = this.$refs.snackbar;
      var data = {
        message: message,
      };
      sb.MaterialSnackbar.showSnackbar(data);
    }
  },

  computed: {
    name: function() {
      if (this.user) {
        if (this.user.student) {
          return this.user.student.name;
        } else if (this.user.staff) {
          return this.user.staff.name + ' [staff]'; 
        } else {
          return 'Not logged in';
        }
      }
    },

    isStaff: function() {
      if (this.user) {
        if (this.user.staff) {
          return true;
        }
      }
      
      return false;
    },

    isStudent: function() {
      if (this.user) {
        if (this.user.student) {
          return true;
        }
      }
      
      return false;
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
