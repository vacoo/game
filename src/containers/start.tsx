import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Start = class Start extends React.Component {
    render() {
        return (
            <div>
                <h1 className="title">Игра крестики нолики</h1>
                <p className="subtitle">Супер игра</p>
                <Link to="/game" replace={true} className="button">
                    Начать игру
                </Link>
            </div>
        );
    }
};

function mapStateToProps(state: any) {
    return {};
}

export default connect(mapStateToProps)(Start);
