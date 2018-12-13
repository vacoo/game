import * as GameConstants from "@resources/game/constants";

export enum UserType {
    AI = "AI",
    USER = "USER"
}

export interface FieldInterface {
    type: UserType | null;
    state: boolean;
}

export interface GameStateInterface {
    size: number; // размер поля
    values: Array<Array<FieldInterface>>; // Значения
    userScore: number;
    aiScore: number;
}

export const initialState: GameStateInterface = {
    size: 3,
    values: [],
    userScore: 0,
    aiScore: 0
};

export default function gameReducer(state: GameStateInterface = initialState, action: any) {
    switch (action.type) {
        case GameConstants.GENERATE_FIELD:
            return {
                ...state,
                values: action.data.values,
                userScore: action.data.win === UserType.USER ? state.userScore + 1 : state.userScore,
                aiScore: action.data.win === UserType.AI ? state.aiScore + 1 : state.aiScore
            };
        case GameConstants.REPEAT_GAME:
            return {
                ...state,
                userScore: 0,
                aiScore: 0
            };
        case GameConstants.SET:
            return {
                ...state,
                values: action.data.values
            }    
    }
    return state;
}
