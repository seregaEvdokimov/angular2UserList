/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {IUser} from './user'

export interface IModal {
  active: boolean,
  element?: HTMLElement,
  model?: IUser
}
