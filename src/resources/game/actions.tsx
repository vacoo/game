import * as GameConstants from "@resources/game/constants";
import * as GameReducer from "@resources/game/reducer";

// Количество проставленных точек
function squareCheckedCount(square: Array<Array<GameReducer.FieldInterface>>) {
    let checked = 0;
    for (let row in square) {
        for (let col in square[row]) {
            if (square[row][col].state) {
                checked += 1;
            }
        }
    }

    return checked;
}

// Симуляция ИИ
function aiChoose(square: Array<Array<GameReducer.FieldInterface>>): { row: number; col: number } | boolean {
    // Вычисляем количество проставленных ячеек
    let checked = squareCheckedCount(square);

    if (checked >= square.length * square.length) {
        // У ИИ нету ходов
        return false;
    }

    let row = Math.floor(Math.random() * square.length);
    let col = Math.floor(Math.random() * square.length);

    while (square[row][col].state === true) {
        row = Math.floor(Math.random() * square.length);
        col = Math.floor(Math.random() * square.length);
    }

    return { row, col };
}

// Выяснияет кто выиграл
function winUser(win: Array<GameReducer.UserType>): GameReducer.UserType | null {
    if (
        win.filter((value, index, self) => {
            return self.indexOf(value) === index;
        }).length === 1
    ) {
        return win[0];
    } else {
        return null;
    }
}

// Проверка по горизонтали
function checkWinHorizontal(square: Array<Array<GameReducer.FieldInterface>>): GameReducer.UserType | null {
    let win: Array<GameReducer.UserType> = [];

    for (let row in square) {
        for (let col in square[row]) {
            if (square[row][col].state) {
                win.push(square[row][col].type);
            }
        }
        let result = square.length === win.length ? winUser(win) : null;
        if (result !== null) {
            return result;
        } else {
            win = [];
        }
    }

    return null;
}

// Проверка по вертикали
function checkWinVertical(square: Array<Array<GameReducer.FieldInterface>>): GameReducer.UserType | null {
    let verticalSquare = square.map((col, i) => square.map(row => row[i]));
    return checkWinHorizontal(verticalSquare);
}

function checkWinDiagonal(square: Array<Array<GameReducer.FieldInterface>>): GameReducer.UserType | null {
    let win: Array<GameReducer.UserType> = [];
    let winMirror: Array<GameReducer.UserType> = [];

    // Главная диагональ
    for (let row in square) {
        for (let col in square[row]) {
            if (row === col && square[row][col].state) {
                win.push(square[row][col].type);
            }
        }
    }

    // Побочная диагональ
    for (let row in square) {
        if (square[row][square.length - Number(row) - 1].state) {
            winMirror.push(square[row][square.length - Number(row) - 1].type);
        }
    }

    let winDMain = win.length === square.length ? winUser(win) : null;
    let winDMirror = winMirror.length === square.length ? winUser(winMirror) : null;

    if (winDMain !== null) {
        return winDMain;
    } else if (winDMirror !== null) {
        return winDMirror;
    } else {
        return null;
    }
}

export function set(square: Array<Array<GameReducer.FieldInterface>>, row: number, col: number) {
    // Если выбранная ячейка занята то возвращаем все как есть
    if (square[row][col].state === true) {
        return {
            type: GameConstants.SET,
            data: {
                values: square
            }
        };
    }

    // Отмечаем ход игрока крестиком
    square[row][col] = {
        type: GameReducer.UserType.USER,
        state: true
    };

    // Отмечаем ход ИИ ноликом
    let ai = aiChoose(square);
    if (typeof ai === "object") {
        square[ai.row][ai.col] = {
            type: GameReducer.UserType.AI,
            state: true
        };
    }

    // Проверяем победу по горизонтали
    let win: GameReducer.UserType = null;
    let winHorizontal = checkWinHorizontal(square);
    let winVertical = checkWinVertical(square);
    let winDiagonal = checkWinDiagonal(square);

    if (winHorizontal !== null) {
        win = winHorizontal;
        square = _generateField();
    } else if (winVertical) {
        win = winVertical;
        square = _generateField();
    } else if (winDiagonal) {
        win = winDiagonal;
        square = _generateField();
    } else {
        // Ничья
        if (square.length * square.length === squareCheckedCount(square)) {
            square = _generateField();
        }
    }

    return {
        type: GameConstants.SET,
        data: {
            values: square,
            win: win
        }
    };
}

// Генерирует игровое поле по размеру
function _generateField() {
    let square: Array<Array<GameReducer.FieldInterface>> = [];
    const { size } = GameReducer.initialState;

    for (let i = 0; i < size; i++) {
        let row: Array<GameReducer.FieldInterface> = [];
        for (let j = 0; j < size; j++) {
            row.push({
                type: null,
                state: false
            });
        }
        square.push(row);
    }

    return square;
}

// Генерирует поле
export function clearField() {
    let data: { values: Array<Array<GameReducer.FieldInterface>>; win: GameReducer.UserType } = {
        values: _generateField(),
        win: null
    };

    return {
        type: GameConstants.CLEAR_FIELD,
        data: data
    };
}

export function repeatGame() {
    return {
        type: GameConstants.REPEAT_GAME
    };
}
