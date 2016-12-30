/**
 * Created by s.evdokimov on 23.12.2016.
 */


export interface IUser {
  id: number,
  name: string,
  email: string,
  date: any,
  birth: any,
  avatar: string,
  timePassed: boolean,
  startDate?: string
}
