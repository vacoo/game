import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import * as GameReducer from "@resources/game/reducer";
import * as GameActions from "@resources/game/actions";

type Props = {
    dispatch: Function;
    game: GameReducer.GameStateInterface;
};

const End = class End extends React.Component<Props> {

    componentDidMount() {
        this.props.dispatch(GameActions.generateField());
    }

    result = () => {
        const {aiScore, userScore } = this.props.game;
        if(aiScore === userScore) {
            return "Вы по уровень интелекта как у ИИ";
        } else if(aiScore < userScore) {
            return "Вы предотваритили конец света. Поздравляю. Теперь вы герой."
        } else {
            return "Мне жаль. Терминаторы захватили мир.";
        }
    }

    render() {
        return (
            <div>
                <h1 className="title">Игра закончена</h1>
                <p className="subtitle">{this.result()}</p>
                <Link to="/game" replace={true} className="button" onClick={() => this.props.dispatch(GameActions.repeatGame())}>
                    Заново
                </Link>
            </div>
        );
    }
};

function mapStateToProps(state: any) {
    return {
        game: state.Game
    };
}

export default connect(mapStateToProps)(End);
