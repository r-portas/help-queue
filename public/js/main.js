/**
 * The main vue instance
 * @author Roy Portas <royportas@gmail.com>
 */

var app = new Vue({
  el: '#app',

  data: function() {
    return {
      socket: null,
      user: null
    };
  },

  mounted: function() {
    this.socket = io();

    this.socket.emit('requestHelp');
  }
});
