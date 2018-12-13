import * as GameConstants from "@resources/game/constants";
import * as GameReducer from "@resources/game/reducer";

function checkwin(combinationList: Array<GameReducer.UserType>) {
    if (combinationList.indexOf(GameReducer.UserType.AI) === 0 && combinationList.indexOf(GameReducer.UserType.USER) === -1) {
        return GameReducer.UserType.AI;
    } else if (
        combinationList.indexOf(GameReducer.UserType.USER) === 0 &&
        combinationList.indexOf(GameReducer.UserType.AI) === -1
    ) {
        return GameReducer.UserType.USER;
    } else {
        return null;
    }
}

// Симуляция богоподобного ИИ
function aiChoose(size: number) {
    return Math.floor(Math.random() * (size));
}

export function set(values: Array<Array<GameReducer.FieldInterface>>, row: number, col: number) {
    const { size } = GameReducer.initialState;

    // Если в поле уже стоит то не трогаем
    if(values[row][col].state === true) {
        return {
            type: GameConstants.SET,
            data: {
                values: values
            }
        };
    }

    // Ставим крестик
    let newValues = [...values];
    newValues[row][col] = {
        type: GameReducer.UserType.USER,
        state: true
    };

    // Вычисляем колиечство поставленных ячеек
    let count = 0;
    for (let i = 0; i < newValues.length; i++) {
        for (let c = 0; c < newValues[i].length; c++) {
            if (newValues[i][c].state) {
                count += 1;
            }
        }
    }

    if(count < size * size) {
        // Ставим нолик
        let aiRow = aiChoose(size);
        let aiCol = aiChoose(size);
        while (newValues[aiRow][aiCol].state === true) {
            aiRow = aiChoose(size);
            aiCol = aiChoose(size);
        }
        newValues[aiRow][aiCol] = {
            type: GameReducer.UserType.AI,
            state: true
        };
    }

    let combinationList: Array<GameReducer.UserType> = [];
    let win: GameReducer.UserType | null = null;

    // Проверяем победу по горизонтали
    for (let i = 0; i < newValues.length; i++) {
        for (let c = 0; c < newValues[i].length; c++) {
            if (newValues[i][c].state) {
                combinationList.push(newValues[i][c].type);
            }
        }
        if (combinationList.length === GameReducer.initialState.size) {
            win = checkwin(combinationList);
            if(win !== null) {
                break;
            }
        } else {
            combinationList = [];
        }
    }

    // Проверка победы по вертикали
    if (win === null) {
        // Транспонируем массив
        let rotatedNewValues = newValues.map((col, i) => newValues.map(row => row[i]));

        // Проверяем победу по вертикали
        for (let i = 0; i < rotatedNewValues.length; i++) {
            for (let c = 0; c < rotatedNewValues[i].length; c++) {
                if (rotatedNewValues[i][c].state) {
                    combinationList.push(rotatedNewValues[i][c].type);
                }
            }
            if (combinationList.length === GameReducer.initialState.size) {
                win = checkwin(combinationList);
                if(win !== null) {
                    break;
                }
            } else {
                combinationList = [];
            }
        }
    }

    // Проверка победы по диагонали
    if (win === null) {
        // Главная диагональ
        for (let i = 0; i < newValues.length; i++) {
            for (let c = 0; c < newValues[i].length; c++) {
                if (i === c && newValues[i][c].state) {
                    combinationList.push(newValues[i][c].type);
                }
            }
        }
        if (combinationList.length === GameReducer.initialState.size) {
            win = checkwin(combinationList);
        } else {
            combinationList = [];
        }

        // Побочная диагональ
        for (let i = 0; i < newValues.length; i++) {
            if(newValues[i][GameReducer.initialState.size - i - 1].state) {
                combinationList.push(newValues[i][GameReducer.initialState.size - i - 1].type);
            }
        }
        if (combinationList.length === GameReducer.initialState.size) {
            win = checkwin(combinationList);
        } else {
            combinationList = [];
        }
    }
    
    if (win || count + 1 === size * size) {
        // Если есть победа или ничья то сбрасываем поле и передаем редюсеру кто победил
        let generatedAction = generateField();
        generatedAction["data"]["win"] = win;
        return generatedAction;
    } else {
        return {
            type: GameConstants.SET,
            data: {
                values: newValues
            }
        };
    }
}

// Генерирует поле
export function generateField() {
    let values: Array<Array<GameReducer.FieldInterface>> = [];

    for (let i = 0; i < GameReducer.initialState.size; i++) {
        let field: Array<GameReducer.FieldInterface> = [];

        for (let f = 0; f < GameReducer.initialState.size; f++) {
            field.push({
                type: null,
                state: false
            });
        }

        values.push(field);
    }

    let data: { values: Array<Array<GameReducer.FieldInterface>>; win: GameReducer.UserType } = {
        values: values,
        win: null
    };

    return {
        type: GameConstants.GENERATE_FIELD,
        data: data
    };
}

export function repeatGame() {
    return {
        type: GameConstants.REPEAT_GAME
    };
}
