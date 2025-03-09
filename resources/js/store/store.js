import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./reducer";

const store = configureStore({
    reducer: {
        filter: filterReducer,
    },
});

export default store;
