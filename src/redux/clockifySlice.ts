import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialState} from "../types/types";

const initialState : InitialState = {
    isModalOpen: false,
}

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState,
    reducers: {
        setIsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload
        },
    }
})

export const {
    setIsModalOpen,
} = ClockifySlice.actions
