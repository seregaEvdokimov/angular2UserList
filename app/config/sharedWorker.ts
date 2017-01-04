/**
 * Created by s.evdokimov on 04.01.2017.
 */

import {USER_NEW, USER_TIME_PASSED} from '../components/content/user-list/actions';

export function middlewareSharedWorker(store: any, w: any) {
  var SharedWorker = w.SharedWorker;
  var sharedWorker = new SharedWorker('/app/config/worker.js');
  sharedWorker.port.addEventListener("message", function(e: any) {
    var data = JSON.parse(e.data);
    console.log('worker say: ' + data.type);
    switch (data.type) {
      case 'connect':
        console.info('connect');
        break;
      case 'new user':
        store.dispatch({
          type: USER_NEW,
          payload: {user: data.payload}
        });
        break;
      case 'time passed':
        data.payload.forEach(function(item: any) {
          store.dispatch({
            type: USER_TIME_PASSED,
            payload: {user: item}
          });
        });
        break;
    }
  }, false);

  sharedWorker.port.start();
}
