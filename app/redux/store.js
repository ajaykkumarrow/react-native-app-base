import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import createMiddleware from './middleware/clientMiddleware';
import RestApiClient from '../helpers/RestApiClient';

const client = new RestApiClient();

const logger = createLogger({
  logErrors: false
});

export default function configureStore() {
  const middleware = [createMiddleware({ client })];

  const enhancers = applyMiddleware(...middleware, thunk, logger);

  const store = createStore(rootReducer, enhancers);
  return store;
}
