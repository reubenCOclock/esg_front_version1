import React, { useState, useEffect } from "react";

import axios from "axios";
import "../../styles/components/quiz-sent.scss";
import { PieChart } from "react-minimal-pie-chart";
import DonutChart from "react-svg-donut";
import BarChart from "./BarChart";

const QuizResults = () => {
  let currentUser = sessionStorage.getItem("user");
  let currentUserToken = sessionStorage.getItem("token");
  // creation des etats initiaux

  const [finalPillarScores, setFinalPillarScores] = useState([]);
  const [categoryScores, setCategoryScores] = useState([]);
  const [finalAggregateScore, setFinalAggregateScore] = useState("");

  const [finalQuizResults, setFinalQuizResults] = useState([]);

  const [quizTour, setQuizTour] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [opinion, setOpinion] = useState("");

  const [opinionSent, setOpinionSent] = useState(false);

  const [categorySum, setCategorySum] = useState(0);
  const [pillarSum, setPillarSum] = useState(0);
  const getPillars = async () => {
    // recuperation des pilliers E,S et G
    const getPillars = await axios.get(
      process.env.PROD_URL + "/pillar/v1/getPillars"
    );

    return getPillars.data;
  };

  const getCategoryScoresByPillar = async (pillars) => {
    // recuperation des pillars en parametre et initalisation d'un tableau vide
    // je cree un tableau vide
    const pillarScoresArray = [];
    // en bouclant sur les pillars, je fais appel et recupere les donées des categories associé a chaque pillar dans la boucle
    for (let i = 0; i < pillars.length; i++) {
      // je crée une variable sum en l'initialisant a zero
      let sum = 0;
      const pillarSummary = await axios.get(
        process.env.PROD_URL +
          "/quiz/v1/getCategoryScoresByPillar/" +
          currentUser +
          "/" +
          pillars[i].id
      );

      // dans une boucle imbriqué representant les informations pour chaque categorie j'incremente le sum de chaque categorie pour arriver a un numero total
      for (let j = 0; j < pillarSummary.data.length; j++) {
        sum += pillarSummary.data[j].weight;
      }

      // dans la premiere boucle je cree un objet qui contient l'agregat des poids de la categorie,les donées sur la categorie en cours et le nom du pillar auxquelles la categorie est associé et j'alimente le tableau pillarScoresArray avec cette objet
      sum = Number(sum.toFixed(2));
      pillarScoresArray.push({
        sum: sum,
        categoryScores: pillarSummary,
        pillar: pillars[i].pillar_name,
      });
    }
    // je retourne le tableau d'objets
    return pillarScoresArray;
  };

  const determineCategoryScores = (pillarScores) => {
    // en prenant en parametre le tableau d'objets qui contiennent les informations sur les categories, je cree un tableau cide
    const categoryScoresSummary = [];
    for (let i = 0; i < pillarScores.length; i++) {
      var categoryScoresByPillar = [];
      // je cree une boucle imriqué sur les informations des categories asscociés aux pillars
      for (let j = 0; j < pillarScores[i].categoryScores.data.length; j++) {
        // je crée une variable representant le poids de la category divisé par le l'agregat de la categorie pour standardise
        let weight =
          pillarScores[i].categoryScores.data[j].weight / pillarScores[i].sum;
        // je multiplie le "score" del a categorie, respresenté par proportion multiplié par le poids relatif de la categorie
        let proportion =
          pillarScores[i].categoryScores.data[j].proportion * weight;
        // je cree un tableau contenant le "score" de la category qui est representé par la clé categoryProportion qui standardise le score associé a la categorie par son poids relatif par rapport a l'agregat du poids de la cateogire
        categoryScoresByPillar.push({
          proportion: proportion,
          categoryProportion: proportion / weight,
          pillar: pillarScores[i].pillar,
          category: pillarScores[i].categoryScores.data[j].name,
        });
      }
      // j'alimente le tableau avec les informations de la categorie en cours dans la boucle
      categoryScoresSummary.push({ categoryArray: categoryScoresByPillar });
    }
    // je retourne le tableau
    return categoryScoresSummary;
  };

  const determinePillarScores = async (categoryScores, quizTour) => {
    // je recupere le tableau contenant les informations sur les categories retourné par la fonction "determineCategoryScores" et je cree un tableau vide pillarScoresArray
    const pillarScoresArray = [];
    let pillar;
    let pillarScoreArray;
    for (let i = 0; i < categoryScores.length; i++) {
      //je cree une variable score et je l'initialise a zero
      let score = 0;

      for (let j = 0; j < categoryScores[i].categoryArray.length; j++) {
        // j'incremente la variable score par le score individuelle de la categorie pour arriver au score du pillar
        score += categoryScores[i].categoryArray[j].proportion;
        pillar = categoryScores[i].categoryArray[j].pillar;
      }
      // j'ailiente le tableau
      pillarScoresArray.push({
        pillar: pillar,
        score: score,
      });
    }
    // j'insere les informations dans la bdd
    for (let i = 0; i < pillarScoresArray.length; i++) {
      await axios.post(
        process.env.PROD_URL + "/quiz/v1/insertPillarQuizScores/" + quizTour,
        {
          criteria: pillarScoresArray[i].pillar,
          score: pillarScoresArray[i].score,
        }
      );
    }
    // je retourne le tableau
    return pillarScoresArray;
  };

  const getAggregateQuizScores = async () => {
    const aggregateCategoryScores = await axios.get(
      process.env.PROD_URL + "/quiz/v1/getAggregateScores/" + currentUser
    );
    let sum = 0;
    for (let i = 0; i < aggregateCategoryScores.data.length; i++) {
      console.log("this is the multiplications result");
      console.log(i);
      console.log(aggregateCategoryScores.data[i].muliplication_result);
      sum += aggregateCategoryScores.data[i].muliplication_result;
    }
    return sum.toFixed(2);
  };

  const determineCategorySum = (categoriesArray) => {
    let sum = 0;
    for (let i = 0; i < categoriesArray.length; i++) {
      for (let j = 0; j < categoriesArray[i].categoryArray.length; j++) {
        sum += categoriesArray[i].categoryArray[j].categoryProportion;
      }
    }
    return sum;
  };

  const determinePillarSum = (pillarArray) => {
    let sum = 0;
    for (let i = 0; i < pillarArray.length; i++) {
      sum += pillarArray[i].score;
    }
    return sum;
  };

  const getData = async () => {
    setIsLoading(false);
    // recuperation des pillars
    const getPillarInformation = await getPillars();
    // appel a la fonction getPillarScores avec les informations des pillars en parametre,creation du tableau qui crée les informations sur les categories
    const getPillarScores = await getCategoryScoresByPillar(
      getPillarInformation
    );

    // determination des "scores" pour chaque categorie en mettant en parametre le tableau des pillars
    const getCategoryScoreInformation = await determineCategoryScores(
      getPillarScores
    );

    //console.log("here is the category score information");
    //console.log(getCategoryScoreInformation);
    // creation de l'etat
    setCategoryScores(getCategoryScoreInformation);

    const getQuizTour = await axios.get(
      process.env.PROD_URL + "/quiz/v1/findQuizTour/" + currentUser
    );

    //a partir des donées sur les categories je determine les scores pour les pillars associé aux categories en agregat les "scores" des categories contenu dans le tableau "getCategoryScoreInformation"
    const getFinalPillarScores = await determinePillarScores(
      getCategoryScoreInformation,
      getQuizTour.data.id
    );

    // creation de l'etat
    setFinalPillarScores(getFinalPillarScores);

    const getAggregateScore = await getAggregateQuizScores();

    setFinalAggregateScore(getAggregateScore);

    const getCategorySum = await determineCategorySum(
      getCategoryScoreInformation
    );
    setCategorySum(getCategorySum);

    const getPillarSum = await determinePillarSum(getFinalPillarScores);
    setPillarSum(getPillarSum);

    setQuizTour(getQuizTour.data);
  };

  console.log("here are the category scores");
  console.log(categoryScores);

  //console.log("final pillar scores");
  //console.log(finalPillarScores);

  console.log("here is the category sum");
  console.log(categorySum);

  useEffect(() => {
    getData();
  }, []);

  if (isLoading == false) {
    return (
      <>
        <div class="containter">
          <div class="result-box">
            <div class="quiz-sent-cont">
              <div class="quiz-sent-msg">
                Merci, vous avez bien envoyé votre quiz
              </div>
            </div>
            <div class="align-center font-bold fs-20">
              Distribution Profil ESG Par Categorie
            </div>
            <div class="score-results">
              {categoryScores.map((elementArray) => {
                return elementArray.categoryArray.map((element) => {
                  const elementScore = element.categoryProportion * 100;
                  return (
                    <div class="score-results-cont padding-box">
                      <div class="font-bold"> {element.category}</div>
                      <div class="align-self-score font-bold">
                        {" "}
                        {elementScore.toFixed(2)} %
                      </div>
                    </div>
                  );
                });
              })}
            </div>
            <br />
            <div class="align-center font-bold fs-20">
              Distribution Profil ESG Par Pillar
            </div>
            <div class="score-results">
              {finalPillarScores.map((element) => {
                //console.log("here is the element");
                //console.log(element);
                const elementScore = element.score * 100;
                return (
                  <div class="score-results-cont padding-box">
                    <div class="font-bold"> {element.pillar}</div>
                    <div class="align-self-score font-bold">
                      {" "}
                      {elementScore.toFixed(2)}%{" "}
                    </div>
                  </div>
                );
              })}
            </div>
            <div class="align-center font-bold fs-20">
              {" "}
              Score Final Agregé ESG
            </div>
            <div class="score-results">
              <div class="score-results-cont padding-box">
                <div class="align-self-score font-bold">
                  {finalAggregateScore * 100}%
                </div>
              </div>
            </div>
          </div>

          <div class="form-container">
            {opinionSent == true ? (
              <div class="text-center opinion-sent-msg">
                Merci d'avoir partager votre avis
              </div>
            ) : (
              <span></span>
            )}
            <div class="text-center title-responsive">
              {" "}
              Partager Votre avis sur ce questionnaire
            </div>

            <BarChart categories={categoryScores} sum={categorySum} />
          </div>
        </div>
      </>
    );
  } else {
    return <div> Page is Loading</div>;
  }
};

export default QuizResults;
