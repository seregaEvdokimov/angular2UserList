/**
 * Created by s.evdokimov on 04.01.2017.
 */

import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';

import {TRANSLATE} from '../../components/header/actions'

@Injectable()
export class DictionaryService {

  // INIT

  currentLang: string = '';
  localizationStrings: any = {};

  patterns = {
    name: /(%name)/g,
    id: /(%id)/g,
    number: /(%number)/g
  };

  url: string = 'http://localhost:4001/language';

  constructor(private http: Http) {}

  // METHODS

  loadLocalization(data: any, callbacks: any) {
    this.currentLang = data.lang;

    let params = new URLSearchParams();
    params.set('lang', data.lang);

    this.http.get(this.url, {search: params}).subscribe(res => {
      this.localizationStrings = res.json();

      callbacks.header({type: TRANSLATE});
      callbacks.userList({type: TRANSLATE});
      callbacks.modal({type: TRANSLATE});
    });
  }

  t(keys: string[]): string {
    let words: any = this.localizationStrings;

    let iter: any = function(list: string[], acc: any) {
      if(list.length <= 1) return acc[list[0]];

      if(list.length > 1) acc = acc[list.shift()];
      return iter(list, acc);
    };

    return iter(keys, words);
  }

  getMessage(params: any, keys: string[]) {
    var str: string = this.t(keys);

    for(var index in params) {
      str = str.replace(this.patterns[index], params[index]);
    }

    return str;
  }
}
