import server from '../dist/server.cjs';

const app = server.default || server;

export default function handler(req, res) {
  return app(req, res);
}
