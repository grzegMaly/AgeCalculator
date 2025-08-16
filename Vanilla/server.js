const dotEnv = require('dotenv');
dotEnv.config({
    path: './config.env'
});
process.on('uncaughtException', err => {
    console.error('uncaughtException', err.name, err.message);
    process.exit(1);
});

const app = require('./app');
const raw = process.env.APP_PORT;
const port = raw === undefined ? 5000 : Number(raw);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error(`Invalid APP_PORT: ${raw}`)
    process.exit(1);
}

const server = app.listen(port);
server.on('listening', () => {
    console.log(`Server Listening on port: ${port}`);
});

server.on('error', err => {
    console.error('server.on-error', err.name, err.message);
    process.exit(1);
})

process.on('unhandledRejection', err => {
    console.error('unhandledRejection', err.name, err.message);
    server.close(() => process.exit(1));
});