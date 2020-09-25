import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import QuizInstructions from "./components/quiz/QuizInstructions";
import Play from "./components/quiz/Play";
import QuizSummary from "./components/quiz/QuizSummary";
import PlayNew from "./components/quiz/PlayNew";
import UserSignUp from "./components/quiz/UserSignUp";
import QuizSent from "./components/quiz/QuizSent";
import Header from "./components/quiz/Header";
import About from "./components/quiz/About";
import ScoreReliability from "./components/quiz/ScoreReliability";
import QuestionStatistics from "./components/quiz/QuestionStatistics";
import Inscription from "./components/quiz/Inscription";
import Connexion from "./components/quiz/Connexion";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path="/registerEmail" exact component={UserSignUp} />
          <Route path="/" exact component={Home} />
          <Route path="/play/instructions" exact component={QuizInstructions} />
          <Route path="/signup" exact component={Inscription} />
          <Route path="/play/quiz/:questionOrder?" exact component={PlayNew} />
          <Route path="/play/quizSummary" exact component={QuizSummary} />
          <Route path="/quizresults" exact component={QuizSent} />
          <Route path="/about" exact component={About} />
          <Route path="/test-reliability" exact component={ScoreReliability} />
          <Route path="/signin" exact component={Connexion} />

          <Route
            path="/question-stats/:questionId/:questionOrder"
            exact
            component={QuestionStatistics}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
