import { observable, action } from 'mobx';

class GlobalStore {

  @observable flash = null;
  @observable title = null;
  @observable uid = null;
  @observable email = null;
  @observable propmt = null;
  @observable params = null;
  @observable uris = null;


  @action.bound
  setInitialState(initialState) {
    if(initialState === undefined) {
      return
    }
    if(initialState.hasOwnProperty('title')) {
      this.title = initialState.title;
    }
    if(initialState.hasOwnProperty('uid')) {
      this.uid = initialState.uid;
    }
    if(initialState.hasOwnProperty('email')) {
      this.email = initialState.email;
    }
    if(initialState.hasOwnProperty('uris')) {
      this.uris = initialState.uris;
    }
    if(initialState.hasOwnProperty('flash')) {
      this.flash = initialState.flash;
    }
    if(initialState.hasOwnProperty('prompt')) {
      this.prompt = initialState.prompt;
    }
    if(initialState.hasOwnProperty('params')) {
      this.params = initialState.params;
    }
}

  @action.bound
  setFlash(flash) {
    this.flash = flash
  }
}
export default  GlobalStore