import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Score from "@components/score";

import * as GameReducer from "@resources/game/reducer";
import * as GameActions from "@resources/game/actions";

type Props = {
    dispatch: Function;
    game: GameReducer.GameStateInterface;
};

const Game = class Game extends React.Component<Props> {
    componentDidMount() {
        this.props.dispatch(GameActions.generateField());
    }

    onItemClick = (row: number, col: number) => {
        this.props.dispatch(GameActions.set(this.props.game.values, row, col));
    }

    repeatGame = () => {
        window.location.hash = "end";
    }

    breakGame = () => {
        this.props.dispatch(GameActions.generateField());
    }

    render() {
        return (
            <div>
                <h1 className="title">Игра</h1>
                <p className="subtitle">Ваша цель победить могучий ИИ</p>
                <button className="button" onClick={this.breakGame}>Заново</button>
                {(this.props.game.aiScore > 0 || this.props.game.userScore > 0) && <button className="button" onClick={this.repeatGame}>Закончить игру</button>}
                <table>
                    <tbody>
                        {this.props.game.values.map((tr, trIndex) => (
                            <tr key={trIndex}>
                                {tr.map((td, tdIndex) => (
                                    <td onClick={() => this.onItemClick(trIndex, tdIndex)} key={tdIndex}>{td.state ? (td.type === GameReducer.UserType.AI ? "O" : "X") : ""}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Score userScore={this.props.game.userScore} aiScore={this.props.game.aiScore} />
            </div>
        );
    }
};

function mapStateToProps(state: any) {
    return {
        game: state.Game
    };
}

export default connect(mapStateToProps)(Game);
