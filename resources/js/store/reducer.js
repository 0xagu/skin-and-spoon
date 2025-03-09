import { SET_FILTER } from '../store/action'; // ✅ Import the action type

const initialState = {
    filter: "All", // Default
};

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTER:
            return {
                ...state,
                filter: action.payload,
            };
        default:
            return state;
    }
};

export default filterReducer;
