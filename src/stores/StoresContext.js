import React from 'react'
import GlobalStore from  './domains/GlobalStore'
import DebugStore from './domains/DebugStore'

/*
class RootStore {

  globalStore;
  debugStore;

  constructor(initialState) {

    if(initialState !== undefined) {
      if(initialState !== undefined) {
        this.globalStore = new GlobalStore(this, initialState)
      } else {
        this.debugStore = new GlobalStore(this, initialState)
      }
    }
  }

}
export default RootStore;
*/
export const globalStore = new GlobalStore()
export const debugStore = new DebugStore()
export const storesContext =  React.createContext({
    globalStore: globalStore,
    debugStore: debugStore
})

export function setInitialState(initialState) {
  globalStore.setInitialState(initialState);
  debugStore.setInitialState(initialState);
  return {globalStore:globalStore, debugStore: debugStore}
}

