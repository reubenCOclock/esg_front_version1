import React, { Component, Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "../../styles/components/progress.scss";

const QuizProgress = async (userId) => {
  let userToken = sessionStorage.getItem("token");
  const getQuizTour = await axios.get(
    "http://localhost:3000/findQuizTour/" + userId,
    { headers: { authorization: "Bearer " + userToken } }
  );
  const getDataWeights = async () => {
    const dataWeights = await axios.get(
      "http://localhost:3000/aggregateDataWeights/" + userId
    );
    return dataWeights.data;
  };

  const setCriteriaResultsFunction = async (criterias) => {
    const criteriaResultsCopy = [];

    // cette fonction vise a recuperer les information concernant la reponse a une question et les datapoints associé a la question en groupant par des questions associé au criteres E,S et G en bouclant encore sur le tableaux des criteres.
    for (let i = 0; i < criterias.length; i++) {
      const quizResultsByCriteria = await axios.get(
        "http://localhost:3000/groupQuestionsAndAnswers/" +
          criterias[i].ethical_code +
          "/" +
          userId
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

  const getCriteriaWeights = await getDataWeights();

  const getCriteriaResultsTotal = await setCriteriaResultsFunction(
    getCriteriaWeights
  );

  const getResultsSum = await calculateResultsSum(getCriteriaResultsTotal);

  const getResultsSumAsPercentage = await calculateResultsPercentage(
    getResultsSum,
    getCriteriaWeights
  );

  const getTotalSum = calculateSum(getResultsSumAsPercentage);

  const getFinalPercentageAllocation = setPercentageAllocationFunction(
    getResultsSumAsPercentage,
    getTotalSum,
    getCriteriaWeights
  );

  return getFinalPercentageAllocation;
};

export default QuizProgress;
