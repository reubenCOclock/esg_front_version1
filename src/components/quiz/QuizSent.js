import React, { useState, useEffect } from "react";

import axios from "axios";
import "../../styles/components/quiz-sent.scss";

const QuizSent = () => {
  let currentUser = sessionStorage.getItem("user");
  let currentUserToken = sessionStorage.getItem("token");
  // creation des etats initiaux

  const [criterias, setCriterias] = useState([]);

  const [finalQuizResults, setFinalQuizResults] = useState([]);

  const [quizTour, setQuizTour] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [opinion, setOpinion] = useState("");

  const [opinionSent, setOpinionSent] = useState(false);

  const getDataWeights = async (userId) => {
    const dataWeights = await axios.get(
      process.env.PROD_URL + "/aggregateDataWeights/" + userId
    );
    return dataWeights.data;
  };
  const setCriteriaResultsFunction = async (criterias, currentUser) => {
    const criteriaResultsCopy = [];

    // cette fonction vise a recuperer les information concernant la reponse a une question et les datapoints associé a la question en groupant par des questions associé au criteres E,S et G en bouclant encore sur le tableaux des criteres.
    for (let i = 0; i < criterias.length; i++) {
      const quizResultsByCriteria = await axios.get(
        process.env.PROD_URL +
          "/groupQuestionsAndAnswers/" +
          criterias[i].ethical_code +
          "/" +
          currentUser
      );
      criteriaResultsCopy.push(quizResultsByCriteria.data);
    }
    // je retourne les resultats
    return criteriaResultsCopy;
  };

  const calculateResultsSum = async (array) => {
    let resultsCopy = [];
    let ethicalCode;
    // cette fonction vise a calculer l'aggregation des resultats par rapport a la poids d'une reponse et la ponderation du datapoint concerné, elle boucle sur un tableau qui contient un tableau qui est le resultat de la fonction "setCriteriaResultsFunction" et donc sur un tableau deja trié par E,S et G
    for (let i = 0; i < array.length; i++) {
      // creation d'un objet vide
      const infoTab = {};

      let sum = 0;
      ethicalCode = array[i][0].ethical_code;
      for (let j = 0; j < array[i].length; j++) {
        // dans la boucle le sum est incrementé par le resultat de la multiplication
        sum += array[i][j].multiplication_result;
      }
      // alimentation de l'objet
      infoTab.sum = sum;
      infoTab.ethical_code = ethicalCode;
      // l'objet est ajouté au tableau
      resultsCopy.push(infoTab);
    }

    return resultsCopy;
  };

  const calculateResultsPercentage = (scoreArray, countArray) => {
    // cette fonction vise a determiner le pourcentage associé pour chauque critere en divisant par l'aggreation des reponses multiplié par la ponderation divisé par le nombre d'occurence du critere visé
    const percentageArrayCopy = [];
    // ce tableau est crée en bouclant sur le tableau crée dans la fonction "calcuateResultsSum" en divisant par le tableau crée dans la fonction "setCriteriaCountFunction"
    for (let i = 0; i < scoreArray.length; i++) {
      percentageArrayCopy.push(scoreArray[i].sum / countArray[i].sum);
    }
    // le resultant est affiché dans le tableau retourné
    return percentageArrayCopy;
  };

  const calculateSum = (array) => {
    // cette fonction vise a determiner l'aggreation des pourcentages calculés dans la fonction "calculateResultsPercentage"
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }

    return sum;
  };

  const setPercentageAllocationFunction = (
    percentageArray,
    total,
    codeArray
  ) => {
    // cette fonction vise a determiner le resulatt final pour chaque critere en divisant le pourcentage determiné pour chauqe critere dans la fonction "calculateResultsPercentage" en divisant par le resultant trouvé  dans la fonction "calculateSum" pour pouvoir determiner le penchement pour chaque critere de l'utilisateur
    const newPercentageAllocationArray = [];
    for (let i = 0; i < percentageArray.length; i++) {
      newPercentageAllocationArray.push({
        total: ((percentageArray[i] / total) * 100).toFixed(2),
        code: codeArray[i].ethical_code,
      });
    }

    return newPercentageAllocationArray;
  };

  const insertQuizTour = async (
    percentageAllocationArr,
    currentUser,
    currentQuiz
  ) => {
    // insertion des resultats de la fonction "setPercentageAllocationFunction" en bouclant sur le tableau
    const insertedQuizzes = [];
    for (let i = 0; i < percentageAllocationArr.length; i++) {
      console.log("percentage allocation in loop");
      console.log(percentageAllocationArr[i]);

      const insertTour = await axios.post(
        process.env.PROD_URL +
          "/insertQuizScore/" +
          currentUser +
          "/" +
          currentQuiz,
        {
          ethicalCriteria: percentageAllocationArr[i].code,
          score: percentageAllocationArr[i].total,
        }
      );

      insertedQuizzes.push(insertTour.data);
    }

    // retourne le tableau
    console.log("function inserted quizzes");
    console.log(insertedQuizzes);
    return insertedQuizzes;
  };

  const isQuizAlreadyInserted = async (
    percentageAllocationArr,
    userId,
    quizTour
  ) => {
    const getUserQuizScore = await axios.get(
      process.env.PROD_URL + "/getQuizScoreByUser/" + userId
    );

    // si il y a  pas deja des resultats sur le quiz soumi dans la bdd je fais appel a la fonction pour inserer les resultats du quiz
    if (getUserQuizScore.data.length == 0) {
      const insertedQuizzes = await insertQuizTour(
        percentageAllocationArr,
        userId,
        quizTour
      );

      return insertedQuizzes;
    } else {
      return getUserQuizScore.data;
    }
  };

  const getData = async () => {
    setIsLoading(false);

    //const getCriteriaWeights = await getDataWeights(currentUser);

    const getQuizTour = await axios.get(
      process.env.PROD_URL + "/findQuizTour/" + currentUser,
      { headers: { authorization: "Bearer " + currentUserToken } }
    );

    setQuizTour(getQuizTour.data);
  };

  useEffect(() => {
    getData();
  }, []);

  //console.log(finalQuizResults);
  //console.log(finalQuizResults);
  if (isLoading == false) {
    return (
      <>
        <div class="container">
          <div class="result-box">
            <div class="quiz-sent-cont">
              <div class="quiz-sent-msg">
                Merci, vous avez bien envoyé votre quiz
              </div>
            </div>
            <div class="align-center font-bold fs-20">
              Voici La Distribution de votre profil ESG
            </div>
            <div class="score-results"></div>
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
                console.log("the form has been submitted");
                await axios.post(
                  process.env.PROD_URL +
                    "/insertQuizOpinion/" +
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

export default QuizSent;
