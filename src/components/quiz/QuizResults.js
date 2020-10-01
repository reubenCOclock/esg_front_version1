import React, { useState, useEffect } from "react";

import axios from "axios";
import "../../styles/components/quiz-sent.scss";
import { PieChart } from "react-minimal-pie-chart";

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

  const getPillars = async () => {
    const getPillars = await axios.get(
      "http://localhost:3000/pillar/v1/getPillars"
    );
    //console.log(getPillars.data);
    return getPillars.data;
  };

  const getCategoryScoresByPillar = async (pillars) => {
    //console.log(pillars);
    const pillarScoresArray = [];
    for (let i = 0; i < pillars.length; i++) {
      let sum = 0;
      const pillarSummary = await axios.get(
        "http://localhost:3000/quiz/v1/getCategoryScoresByPillar/" +
          pillars[i].id
      );

      //console.log(pillarSummary.data);
      for (let j = 0; j < pillarSummary.data.length; j++) {
        sum += pillarSummary.data[j].weight;
      }
      sum = Number(sum.toFixed(2));
      pillarScoresArray.push({
        sum: sum,
        categoryScores: pillarSummary,
        pillar: pillars[i].pillar_name,
      });
    }
    return pillarScoresArray;
  };

  const determineCategoryScores = (pillarScores) => {
    const categoryScoresSummary = [];
    for (let i = 0; i < pillarScores.length; i++) {
      var categoryScoresByPillar = [];

      for (let j = 0; j < pillarScores[i].categoryScores.data.length; j++) {
        let weight =
          pillarScores[i].categoryScores.data[j].weight / pillarScores[i].sum;
        let proportion =
          pillarScores[i].categoryScores.data[j].proportion * weight;

        categoryScoresByPillar.push({
          proportion: proportion,
          categoryProportion: proportion / weight,
          pillar: pillarScores[i].pillar,
          category: pillarScores[i].categoryScores.data[j].name,
        });
      }

      categoryScoresSummary.push({ categoryArray: categoryScoresByPillar });
    }

    return categoryScoresSummary;
  };

  const determinePillarScores = async (categoryScores, quizTour) => {
    const pillarScoresArray = [];
    let pillar;
    let pillarScoreArray;
    for (let i = 0; i < categoryScores.length; i++) {
      let score = 0;

      for (let j = 0; j < categoryScores[i].categoryArray.length; j++) {
        score += categoryScores[i].categoryArray[j].proportion;
        pillar = categoryScores[i].categoryArray[j].pillar;
      }
      pillarScoresArray.push({
        pillar: pillar,
        score: score,
      });
    }
    for (let i = 0; i < pillarScoresArray.length; i++) {
      await axios.post(
        "http://localhost:3000/quiz/v1/insertPillarQuizScores/" + quizTour,
        {
          criteria: pillarScoresArray[i].pillar,
          score: pillarScoresArray[i].score,
        }
      );
    }

    return pillarScoresArray;
  };

  const getAggregateQuizScores = async () => {
    const aggregateCategoryScores = await axios.get(
      "http://localhost:3000/quiz/v1/getAggregateScores"
    );
    let sum = 0;
    for (let i = 0; i < aggregateCategoryScores.data.length; i++) {
      sum += aggregateCategoryScores.data[i].muliplication_result;
    }
    return sum.toFixed(2);
  };

  const getData = async () => {
    setIsLoading(false);

    const getPillarInformation = await getPillars();
    const getPillarScores = await getCategoryScoresByPillar(
      getPillarInformation
    );

    //console.log("here are the category scores");
    //console.log(getPillarScores);

    //const getCriteriaWeights = await getDataWeights(currentUser);

    const getCategoryScoreInformation = await determineCategoryScores(
      getPillarScores
    );

    console.log("here is the category score information");
    console.log(getCategoryScoreInformation);

    setCategoryScores(getCategoryScoreInformation);

    const getQuizTour = await axios.get(
      "http://localhost:3000/quiz/v1/findQuizTour/" + currentUser
    );

    //console.log("quiz tour information");
    //console.log(getQuizTour);
    const getFinalPillarScores = await determinePillarScores(
      getCategoryScoreInformation,
      getQuizTour.data.id
    );

    //console.log("here is the pillar score information");
    //console.log(getFinalPillarScores);

    setFinalPillarScores(getFinalPillarScores);

    const getAggregateScore = await getAggregateQuizScores();

    console.log("final quiz score");
    console.log(getAggregateScore);

    setFinalAggregateScore(getAggregateScore);

    setQuizTour(getQuizTour.data);
  };

  useEffect(() => {
    getData();
  }, []);
  //console.log("state pillar scores");
  //console.log(finalPillarScores);
  //console.log("state category scores");
  //console.log(categoryScores);

  if (isLoading == false) {
    return (
      <>
        ;
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
                  return (
                    <div class="score-results-cont padding-box">
                      <div class="font-bold"> {element.category}</div>
                      <div class="align-self-score font-bold">
                        {" "}
                        {element.categoryProportion.toFixed(2) * 100} %
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
                return (
                  <div class="score-results-cont padding-box">
                    <div class="font-bold"> {element.pillar}</div>
                    <div class="align-self-score font-bold">
                      {" "}
                      {element.score.toFixed(2) * 100}%{" "}
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
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setOpinionSent(true);
                //console.log("the form has been submitted");
                await axios.post(
                  "http://localhost:3000/insertQuizOpinion/" +
                    quizTour.id +
                    "/" +
                    currentUser,
                  { opinion: opinion }
                );
                document.querySelector(".textarea").value = "";
              }}
              method="post"
              action=""
            >
              <div class="flex-text-area">
                <textarea
                  class="textarea"
                  onChange={(event) => {
                    setOpinion(event.target.value);
                  }}
                ></textarea>
              </div>

              <div class="btn-cont">
                <button class="send-opinion-btn" type="submit">
                  {" "}
                  Envoyer Votre Avis
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  } else {
    return <div> Page is Loading</div>;
  }
};

export default QuizResults;
