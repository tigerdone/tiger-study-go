const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!');
});
const port = 3000;
server.listen(port, () => {
    console.log(`服务器正在监听端口 ${port}`);
});