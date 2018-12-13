import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

import GameReducer from "@resources/game/reducer";

const loggerMiddleware = createLogger();

export default function configureStore() {
    let store = createStore(
        combineReducers({
            Game: GameReducer
        }),
        applyMiddleware(
            thunkMiddleware,
            // loggerMiddleware
        )
    );
    return store;
}
