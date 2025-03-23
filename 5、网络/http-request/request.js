// const https = require('https');
const http = require('http');

http.get('http://localhost:3000', (response) => {
  let todo = '';

  // called when a data chunk is received.
  response.on('data', (chunk) => {
    todo += chunk;
  });

  // called when the complete response is received.
  response.on('end', () => {
    console.log(todo);
  });

}).on("error", (error) => {
  console.log("Error: " + error.message);
});