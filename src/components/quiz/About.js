import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import M from "materialize-css";
import { Link, Router } from "react-router-dom";
import classnames from "classnames";

import questions from "../../questions.json";
import isEmpty from "../../utils/is-empty";

import correctNotification from "../../assets/audio/correct-answer.mp3";
import wrongNotification from "../../assets/audio/wrong-answer.mp3";
import buttonSound from "../../assets/audio/button-sound.mp3";
import "../../styles/components/about.scss";

const About = () => {
  return (
    <>
      <div class="description-container">
        <h4 class="description"> Description d'ESG</h4>
        <p>
          ESG est une application pour but de determiner votre profil moral
          d'investissement. Beaucoup predisent que les considerations morales et
          ethiques d'un investisseur sertont de plus en plus determiner par son
          profil ethique. Dans Un premier temps,un questionnaire vous sera
          fourni afin de determiner votre profil d'investissuer sur trois
          criteres principaux. Ethiques, Social, Gouvernance. A la fin du
          questionnaire une ponderation visant a determiner quelle est
          l'importance de chaque critere dans votre profil ESG vous sera fourni
        </p>
      </div>
    </>
  );
};

export default About;
