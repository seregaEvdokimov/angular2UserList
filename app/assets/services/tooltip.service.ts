/**
 * Created by s.evdokimov on 03.01.2017.
 */

import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';

import {TOOLTIP_SHOW} from '../../components/additional/tooltip/actions';

@Injectable()
export class TooltipService {

  // INIT

  constructor(private http: Http) {}

  // METHODS

  getData(payload: any, callback: any) {
    let params = new URLSearchParams();
    params.set('type', payload.type);
    params.set('id', payload.id);

    this.http.get('http://localhost:4001/tooltip', {search: params}).subscribe(res => {
      let data = Object.assign(res.json(), payload);
      callback({
        type: TOOLTIP_SHOW,
        payload: data
      });
    });
  }
}
