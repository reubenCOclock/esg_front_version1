import React, { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

import CaptureA from "../../assets/img/CaptureA.PNG";
import "../../styles/components/_quiz-instructions.scss";
//import fiftyFifty from '../../assets/img/fiftyFifty.PNG';
//import hints from '../../assets/img/hints.PNG';
//import options from '../../assets/img/options.PNG';

const QuizInstructions = () => (
  <Fragment>
    <Helmet>
      <title>Quiz Instructions - Quiz App</title>
    </Helmet>
    <h1> HELLO WORLD</h1>
    <div className="instructions container">
      {/* 
      <ul className="browser-default" id="main-list">
        <li>Le but du questionnaire est de définir votre profil éthique</li>
        <li>
          Toutes les questions sont relatives à l'environnement, au social et à
          la gouvernance
        </li>

        <li>Vous pouvez à tout moment vous arrêter.</li>
        <li>Plus vous répondez au questionnaire plus la précision augmente</li>
        <li>Vous pouvez aussi suivre vos statistiques avec ce questionnaire</li>
      </ul>
 */}

      <div class="instructions-text">
        <p>
          {" "}
          Le but du questionnaire est de definir votre profil ethique. Chaque
          question est soit lié a l'environment, au social ou a la gouvernance.
          Cliquer sur la crois en haut a droit a tout moment pour quitter. Notez
          aussi que lors que vous repondez a une question vous allez passer
          automatiquement a la question suivante. Si vous trouviez que une
          question n'est pas claire, viuellez l'indiquer.
        </p>
      </div>
      <div class="img-cont">
        <h6 class="example-title">Voici un exemple d'une question </h6>
        <img src={CaptureA} alt="Quiz App options example" />
      </div>
      <div class="buttons-cont">
        <button class="choice-btn">
          <Link class="link" to="/">
            Retour Accueil{" "}
          </Link>
        </button>
        <button class="choice-btn">
          <Link class="link" to="/registerEmail">
            Je prends le quiz
          </Link>
        </button>
      </div>

      <button class="choice-btn-sm">
        <Link class="link" to="/">
          Retour Accueil{" "}
        </Link>
      </button>
      <button class="choice-btn-sm">
        <Link class="link" to="/signup">
          Je prends le quiz
        </Link>
      </button>
    </div>
  </Fragment>
);

export default QuizInstructions;
