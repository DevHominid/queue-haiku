'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Init app
var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

// Home route
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Start server
app.listen(port, function () {
  console.log('Server started on port: ' + port);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJnZXQiLCJyZXEiLCJyZXMiLCJzZW5kIiwibGlzdGVuIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0FBRUE7QUFDQSxJQUFNQSxNQUFNLHdCQUFaO0FBQ0EsSUFBTUMsT0FBT0MsUUFBUUMsR0FBUixDQUFZQyxJQUFaLElBQW9CLElBQWpDOztBQUVBO0FBQ0FKLElBQUlLLEdBQUosQ0FBUSxHQUFSLEVBQWEsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDekJBLE1BQUlDLElBQUosQ0FBUyxjQUFUO0FBQ0QsQ0FGRDs7QUFJQTtBQUNBUixJQUFJUyxNQUFKLENBQVdSLElBQVgsRUFBaUIsWUFBTTtBQUNyQlMsVUFBUUMsR0FBUiw4QkFBdUNWLElBQXZDO0FBQ0QsQ0FGRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuXG4vLyBJbml0IGFwcFxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMDtcblxuLy8gSG9tZSByb3V0ZVxuYXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4ge1xuICByZXMuc2VuZCgnSGVsbG8gV29ybGQhJyk7XG59KTtcblxuLy8gU3RhcnQgc2VydmVyXG5hcHAubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgY29uc29sZS5sb2coYFNlcnZlciBzdGFydGVkIG9uIHBvcnQ6ICR7cG9ydH1gKTtcbn0pO1xuIl19