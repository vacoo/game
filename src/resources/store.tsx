import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

import GameReducer from "@resources/game/reducer";

const loggerMiddleware = createLogger();

export default function configureStore() {
    let middlewares;
    if (process.env.NODE_ENV === "development") {
        middlewares = applyMiddleware(
            thunkMiddleware,
            // loggerMiddleware
        );
    } else {
        middlewares = applyMiddleware(
            thunkMiddleware
        );
    }
    let store = createStore(
        combineReducers({
            Game: GameReducer
        }),
        middlewares
    );
    return store;
}
