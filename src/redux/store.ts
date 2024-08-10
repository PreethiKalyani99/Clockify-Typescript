import {configureStore} from "@reduxjs/toolkit";
import { ClockifySlice } from "./clockifySlice";

type PreloadedState = {

}
export function setupStore(preloadedState? : PreloadedState) {
  return configureStore({
    reducer: {
      clockify: ClockifySlice.reducer
    },
    preloadedState
  })
}

export const store = setupStore()
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch