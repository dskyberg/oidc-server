import { observable, action } from 'mobx';

class DebugStore {
  @observable client = null;
  @observable params = null;
  @observable session = null;

  @action.bound
  setInitialState(initialState) {
    if(initialState === undefined){
        return
    }

    if(initialState.hasOwnProperty('client')) {
    this.client = initialState.client;
    }
    if(initialState.hasOwnProperty('session')) {
    this.session = initialState.session;
    }
    if(initialState.hasOwnProperty('params')) {
    this.params = initialState.params;
    }
  }

}
export default  DebugStore