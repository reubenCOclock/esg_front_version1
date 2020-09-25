import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

class QuizSummary extends Component {
    constructor (props) {
        super(props);
        this.state = {
            score: 0,
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hintsUsed: 0,
            fiftyFiftyUsed: 0
        };
    }

    componentDidMount () {
        const { state } = this.props.location;
        if (state) {
            this.setState({
                score: (state.score / state.numberOfQuestions) * 100,
                numberOfQuestions: state.numberOfQuestions,
                numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
                correctAnswers: state.correctAnswers,
                wrongAnswers: state.wrongAnswers,
                hintsUsed: state.hintsUsed,
                fiftyFiftyUsed: state.fiftyFiftyUsed
            });
        }
    }

    render () {
        const { state } = this.props.location;
        let stats, remark;
        const userScore = this.state.score;

        if (userScore <= 30 ) {
            remark = 'Vous êtes moins sensibles aux critères ESG!';
        } else if (userScore > 30 && userScore <= 50) {
            remark = 'Vous pouvez vous améliorer!';
        } else if (userScore <= 70 && userScore > 50) {
            remark = 'Vous avez une bonne considération des critères ESG!';
        } else if (userScore >= 71 && userScore <= 84) {
            remark = 'Bravo, vous vous souciez au bien être de tout le monde!';
        } else {
            remark = 'Bravo, vous vous souciez parfaitement de l\'environnement du social et de la gouvernance!';
        }

        if (state !== undefined) {
            stats = (
                <Fragment>
                    <div style={{ textAlign: 'center' }}>
                        <span className="mdi mdi-check-circle-outline success-icon"></span>
                    </div>
                    <h1>Votre profil éthique</h1>
                    <div className="container stats">
                        <h4>{remark}</h4>
                        <h2>Environnement: {this.state.score.toFixed(0)}&#37;</h2>
                        <h2>Social: {this.state.score.toFixed(0)}&#37;</h2>
                        <h2>Gouvernance: {this.state.score.toFixed(0)}&#37;</h2>
                        <span className="stat left">Nombre total de questions: </span>
                        <span className="right">{this.state.numberOfQuestions}</span><br />

                        <span className="stat left">Nombre de questions répondues: </span>
                        <span className="right">{this.state.numberOfAnsweredQuestions}</span><br />

                        <span className="stat left">Nombre total de réponses "oui": </span>
                        <span className="right">{this.state.correctAnswers}</span> <br />

                        <span className="stat left">Nombre total autres réponses: </span>
                        <span className="right">{this.state.wrongAnswers}</span><br />

                        <span className="stat left">Hints Used: </span>
                        <span className="right">{this.state.hintsUsed}</span><br />

                        <span className="stat left">50-50 Used: </span>
                        <span className="right">{this.state.fiftyFiftyUsed}</span>
                    </div>
                    <section>
                        <ul>
                            <li>
                                <Link to ="/play/quiz">Recommencer</Link>
                            </li>
                            <li>
                                <Link to ="/">Retour à la page d'accueil</Link>
                            </li>
                        </ul>
                    </section>
                </Fragment>
            );
        } else {
            stats = (
                <section>
                    <h1 className="no-stats">No Statistics Available</h1>
                    <ul>
                        <li>
                            <Link to ="/play/quiz">Take a Quiz</Link>
                        </li>
                        <li>
                            <Link to ="/">Back to Home</Link>
                        </li>
                    </ul>
                </section>
            );
        }
        return (
            <Fragment>
                <Helmet><title>Quiz App - Summary</title></Helmet>
                <div className="quiz-summary">
                    {stats}
                </div>
            </Fragment>
        );
    }
}

export default QuizSummary;