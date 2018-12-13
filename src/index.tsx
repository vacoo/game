import React from "react";
import ReactDom from "react-dom";
import { connect } from "react-redux";
import { HashRouter, Route, Redirect, Link } from "react-router-dom";
import { Provider } from "react-redux";

import Store from "@resources/store";

import Start from "@containers/start";
import End from "@containers/end";
import Game from "@containers/game";

import "@styles/index.scss";

const store = Store();

type Props = {
    dispatch: Function;
};

const App = class App extends React.Component<Props> {
    render() {
        return (
            <HashRouter>
                <div className="container">
                    <div className="section">
                        <Route path="/" exact component={Start} />
                        <Route path="/end" exact component={End} />
                        <Route path="/game" exact component={Game} />
                    </div>
                </div>
            </HashRouter>
        );
    }
};

function mapStateToProps(state: any) {
    return {};
}

const Index = connect(mapStateToProps)(App);

ReactDom.render(
    <Provider store={store}>
        <Index />
    </Provider>,
    document.getElementById("app")
);
