import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';
import routes from '../client/routes/index';
import renderer from './renderer';
import createStore from '../client/createStore';
import axios from 'axios';
import config from '../config';

class WebServer {
  constructor() {
    this.app = express();
  }

  useMiddlewares() {
    this.app.use(
      '/api',
      proxy(
        config.API_URI, {
          proxyReqOptDecorator(proxyReqOpts) {
            proxyReqOpts.headers['x-forwarded-host'] = config.PROXY_REQUEST_HEADER_X_FORWARDED_HOST;
            return proxyReqOpts;
          }
        }
      )
    );

    this.app.use(express.static('client'));
  }

  requestHandling() {
    this.app.get('*', (req, res) => {
      // Create Store
      const axiosInstance = axios.create({
        baseURL: config.API_URI,
        headers: { cookie: req.get('cookie') || '' }
      });

      const store = createStore(undefined, axiosInstance);

      // Load Data And Send HTML
      const promises = matchRoutes(routes, req.path).map(({ route }) => {
        return route.loadData ? route.loadData(store) : null;
      });

      const render = () => {
        const context = {};
        const content = renderer(req, store, context);

        if (context.url) {
          return res.redirect(301, context.url);
        }
        if (context.notFound) {
          res.status(404);
        }

        res.send(content);
      };

      Promise.all(promises).then(render).catch(render);
    });
  }

  listen(port = 3000) {
    this.useMiddlewares();
    this.requestHandling();
    this.app.listen(port);
  }
}

export default new WebServer();