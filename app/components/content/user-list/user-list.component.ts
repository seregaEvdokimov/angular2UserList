/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {IUser} from '../../../assets/interfaces/user';

import {DictionaryService} from '../../../assets/services/dictionary.service';
import {CommunicateService} from '../../../assets/services/communicate.service';

import {TRANSLATE} from '../../header/actions';
import {MODAL_CREATE_SHOW, MODAL_EDIT_SHOW} from '../../additional/modal/actions';
import {TOOLTIP_SHOW, TOOLTIP_HIDE, TOOLTIP_MOVE} from '../../additional/tooltip/actions';
import {USER_LIST_PAGINATION, USER_LIST_SORT, USER_DELETE, FETCH_USER_LIST, USER_NEW} from './actions';


@Component({
  moduleId: module.id,
  selector: 'user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css']
})


export class UserlistComponent implements AfterViewInit, OnInit, OnDestroy {
  // nodes to translate
  @ViewChild('TId')      TId: ElementRef;
  @ViewChild('TName')    TName: ElementRef;
  @ViewChild('TEmail')   TEmail: ElementRef;
  @ViewChild('TBirth')   TBirth: ElementRef;
  @ViewChild('TDate')    TDate: ElementRef;
  @ViewChild('TDelete')  TDelete: ElementRef;
  @ViewChild('TEdit')    TEdit: ElementRef;
  @ViewChild('TBody')    TBody: ElementRef;
  @ViewChild('TAddUser') TAddUser: ElementRef;

  userList: IUser[] = [];
  intervalId: any = null;
  subscription: Subscription;

  constructor(private dictionary: DictionaryService, private communication: CommunicateService) {
    this.subscription = communication.userListOn.subscribe((props: any) => {
      switch(props.type) {
        case FETCH_USER_LIST:
          this.userList = props.payload.users;
          break;
        case TRANSLATE:
          this.translate();
          break;
      }
    });
  }

  ngOnInit() {
    this.communication.appCmpEmit({
      type: FETCH_USER_LIST,
      payload: {start: 0, limit: 10}
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {}

  handlerScroll($event: any) {
    let el: HTMLElement = $event.target;

    let currentScroll = el.scrollTop + el.clientHeight;
    let maxScroll = el.scrollHeight;

    if(currentScroll == maxScroll) {
      this.communication.appCmpEmit({type: USER_LIST_PAGINATION});
    }
  }

  handlerSort($event: any):boolean {
    let el: HTMLElement = $event.target;
    if(el.dataset['sortBy'] === undefined) return false;

    let sortType = el.dataset['sortBy'];
    let sortDirection = el.dataset['directionBy'];
    this.communication.appCmpEmit({
      type: USER_LIST_SORT,
      payload: {type: sortType, direction: sortDirection}
    });

    let nodes = [].slice.apply(el.parentNode.childNodes);
    for(let i = 0, len = nodes.length; i < len; i++) {
      if(nodes[i].nodeType === 1) nodes[i].classList.remove('active');
    }

    el.className = 'row__' + sortType + ' active ' + sortDirection;
    el.dataset['directionBy'] = (sortDirection === 'asc') ? 'desc' : 'asc';
  }

  handlerControl($event: any):boolean {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'A') return false;

    let classes = el.classList;
    switch(classes[1]) {
      case 'edit-btn':
        this.editUser($event);
        break;
      case 'delete-btn':
        this.deleteUser($event);
        break;
    }
  }

  handlerMouse($event: any): boolean {
    let type = $event.type;
    let el = $event.target;
    let tooltip = el.dataset.tooltip;

    if(tooltip) {
      let id = parseInt(this.getRow(el).querySelector('.row__link').textContent);
      switch(type) {
        case 'mousemove':
          this.communication.appCmpEmit({
            type: TOOLTIP_MOVE,
            payload: {coords: {x: $event.pageX + 15, y: $event.pageY + 15}}
          });
          break;
        case 'mouseover':
          this.intervalId = setTimeout(() => {
            this.communication.appCmpEmit({
              type: TOOLTIP_SHOW,
              payload: {id: id, type: tooltip, coords: {x: $event.pageX + 15, y: $event.pageY + 15}}
            });
          }, 1000);
          break;
        case 'mouseout':
          clearTimeout(this.intervalId);
          this.communication.appCmpEmit({
            type: TOOLTIP_HIDE,
            payload: {type: tooltip}
          });
          break;
      }
    }

    return true;
  }

  editUser($event: any) {
    let el: HTMLElement = this.getRow($event.target);
    let id = parseInt(el.querySelector('.row__link').textContent);
    this.communication.appCmpEmit({
      type: MODAL_EDIT_SHOW,
      payload: {id: id}
    });
  }

  deleteUser($event: any) {
    let el: HTMLElement = this.getRow($event.target);
    let id = parseInt(el.querySelector('.row__link').textContent);
    this.communication.appCmpEmit({
      type: USER_DELETE,
      payload: {id: id}
    });
  }

  addUser($event: any) {
    this.communication.appCmpEmit({type: MODAL_CREATE_SHOW});
  }

  getRow(el:any): HTMLElement {
    if(!el || el.tagName === 'TR') return el;
    return this.getRow(el['parentNode']);
  }

  translate(): void {
    this.TId.nativeElement.textContent = this.dictionary.t(['content','userTable_headId']);
    this.TName.nativeElement.textContent = this.dictionary.t(['content','userTable_headName']);
    this.TEmail.nativeElement.textContent = this.dictionary.t(['content','userTable_headEmail']);
    this.TBirth.nativeElement.textContent = this.dictionary.t(['content','userTable_headBirth']);
    this.TDate.nativeElement.textContent = this.dictionary.t(['content','userTable_headTime']);
    this.TDelete.nativeElement.textContent = this.dictionary.t(['content','userTable_headDelete']);
    this.TEdit.nativeElement.textContent = this.dictionary.t(['content','userTable_headEdit']);
    this.TAddUser.nativeElement.textContent = this.dictionary.t(['content','footer_addUser']);

    for (var i = 0, len = this.TBody.nativeElement.children.length; i < len; i++) {
      let el = this.TBody.nativeElement.children[i];
      el.querySelector('.row__del a').textContent = this.dictionary.t(['content','userTable_bodyDelete']);
      el.querySelector('.row__edit a').textContent = this.dictionary.t(['content','userTable_bodyEdit']);
    }
  }
}
