export default function clientMiddleware({ client }) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });
    return new Promise((resolve, reject) => {
      const actionPromise = promise({ client }, dispatch);
      actionPromise
        .then(result => {
          if (result.status < 400 || result.status > 600) {
            return result.json();
          }
          return result.json()
            .then(error => {
              const err = error.error;
              reject(next({ ...rest, err, type: FAILURE }));
            });
        })
        .then(response => {
          if (response && (Object.keys(response).length > 0) && response.accessToken !== undefined) {
            client.setAuthToken(response.accessToken.id);
          }
          resolve(next({ ...rest, response, type: SUCCESS }));
        })
        .catch(error => {
          reject(next({ ...rest, error, type: FAILURE }));
        });
      return actionPromise;
    });
  };
}
