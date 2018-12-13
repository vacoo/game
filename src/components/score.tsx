import React from "react";

type Props = {
    userScore: number;
    aiScore: number;
};

export default class Score extends React.Component<Props> {
    render() {
        return (
            <p>
                Ваш счет: {this.props.userScore} | Счет ИИ: {this.props.aiScore}
            </p>
        );
    }
}
