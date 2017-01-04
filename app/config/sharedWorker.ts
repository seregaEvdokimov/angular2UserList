/**
 * Created by s.evdokimov on 04.01.2017.
 */

import {USER_NEW} from '../components/content/user-list/actions';

export function middlewareSharedWorker(store: any, window: any) {
  var SharedWorker = window.SharedWorker;
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
        // let str = Dictionary.getMessage(data.payload, ['notify', 'createUser'], state.HeaderSetting.currentLang);
        // dispatch(notifyActions.notifyCreate(str));
        // dispatch(usersActions.createUserSuccess(data.payload));
        break;
      case 'time passed':
        // data.payload.forEach(function(item) {
        //   let str = Dictionary.getMessage(item, ['notify', 'timePassed'], state.HeaderSetting.currentLang);
        //   dispatch(notifyActions.notifyCreate(str));
        // });
        break;
    }
  }, false);

  sharedWorker.port.start();
}
