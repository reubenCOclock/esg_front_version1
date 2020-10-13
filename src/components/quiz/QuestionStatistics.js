import React, { Component, Fragment, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/components/question_stats.scss";
import QuizProgress from "./QuizProgress";
import ScoreReliability from "./ScoreReliability";

const QuestionStatistics = () => {
  const currentUser = sessionStorage.getItem("user");

  let { questionId } = useParams();
  let { questionOrder } = useParams();

  sessionStorage.setItem("questionOrder", parseInt(questionOrder));

  const [isLoading, setIsLoading] = useState(true);
  const [questionContent, setQuestionContent] = useState("");
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [answerOptions, setAnswerOptions] = useState([
    "oui",
    "non",
    "peut etre",
    "je ne sais pas",
  ]);
  const [totalRespondents, setTotalRespondents] = useState(0);

  const [totalsCategory, setTotalsCategory] = useState([]);

  const establishTotal = (totalArray) => {
    let total = 0;
    for (let i = 0; i < totalArray.data.length; i++) {
      total += Number(totalArray.data[i].total);
    }
    return total;
  };

  const getTotalRespondents = async () => {
    const totalRespondents = await axios.get(
      "http://localhost:3000/totalAnswerRespondents/" + questionId
    );

    let total = 0;
    console.log("total respondents");
    console.log(totalRespondents);
    if (totalRespondents.data.length == 1) {
      total = Number(totalRespondents.data[0].count * 2);
    } else {
      for (let i = 0; i < totalRespondents.data.length; i++) {
        total += Number(totalRespondents.data[i].count);
      }
    }

    return total;
  };

  const establishTotalsByResponse = async (answerOptions) => {
    const array = [];
    for (let i = 0; i < answerOptions.length; i++) {
      const totalAnswersByCategory = await axios.get(
        "http://localhost:3000/totalAnswerCountByResponse/" +
          questionId +
          "/" +
          answerOptions[i]
      );
      array.push(totalAnswersByCategory.data);
    }
    const totalTaggedAnswersByQuestion = await axios.get(
      process.env.REACT_APP_PROD_URL + "/totalTaggedByQuestion/" + questionId
    );
    array.push(totalTaggedAnswersByQuestion.data);
    return array;
  };

  const getData = async () => {
    setIsLoading(false);
    const getQuestionContent = await axios.get(
      process.env.REACT_APP_PROD_URL + "/questionContent/" + questionId
    );
    setQuestionContent(getQuestionContent.data);

    const getTotalAnswers = await axios.get(
      process.env.REACT_APP_PROD_URL + "/getAnswerStats/" + questionId
    );

    const getTotal = establishTotal(getTotalAnswers);
    setTotalAnswers(getTotal);

    const getTotalsByQuestionStats = await establishTotalsByResponse(
      answerOptions
    );
    setTotalsCategory(getTotalsByQuestionStats);

    const totalRespondents = await getTotalRespondents();
    console.log("total respondents information");
    console.log(totalRespondents);
    setTotalRespondents(totalRespondents);
  };

  useEffect(() => {
    getData();
  }, []);
  if (isLoading == false) {
    return (
      <>
        <div class="box-container">
          <div class="flex-end">
            <button class="return">
              {" "}
              <Link to={`/play/quiz/`}>
                <span class="link">Retour au questionnaire</span>
              </Link>{" "}
            </button>
          </div>
          <div class="text-center font-bold fs-l-20 fs-s-12 d-s-none">
            Informations Concernant La Question Ciblé
          </div>
          <div class="flex-question-info">
            <div class="flex-question-info-items">
              <div class="font-bold d-s-none"> Question:</div>
              <div class="ml-5">{questionContent.content}</div>
            </div>
            <div class="mt-10"> </div>
            <div class="flex-question-info-items d-s-flex">
              <div class="font-bold">
                {" "}
                Nombre D'utilisateurs ayant repondu a cette question:{" "}
              </div>
              <div class="ml-5">{totalRespondents}</div>
            </div>
            <div class="mt-10"> </div>
            <div class="flex-question-info-items d-s-flex">
              <div class="font-bold"> Nombre Total de Reponses:</div>
              <div class="ml-5">{totalAnswers}</div>
            </div>

            <table class="table">
              <tbody>
                {totalsCategory.map((element) => {
                  console.log("here is the total");
                  console.log(element.total);
                  if (element.response) {
                    if (element.total) {
                      return (
                        <>
                          <tr>
                            <td>
                              {" "}
                              Nombres de reponses indiquant {element.response}
                            </td>
                            <td>
                              {element.total} (
                              {((element.total / totalAnswers) * 100).toFixed()}
                              %)
                            </td>
                          </tr>
                        </>
                      );
                    }
                  } else {
                    if (element.total) {
                      return (
                        <tr>
                          <td> Nombre de reponses indiquant Pas Claire</td>
                          <td>
                            {element.total} (
                            {((element.total / totalAnswers) * 100).toFixed()}%)
                          </td>
                        </tr>
                      );
                    }
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  } else {
    return <h1> The Page Is Loading</h1>;
  }
};

export default QuestionStatistics;
