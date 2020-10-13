import React, { Component, Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/components/play-new.scss";
import QuizProgress from "./QuizProgress";
import ScoreReliability from "./ScoreReliability";

const PlayNew = () => {
  let currentUser = sessionStorage.getItem("user");

  let currentUserToken = sessionStorage.getItem("token");

  let history = useHistory();
  // definition des etats initiaux
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionCounter, setQuestionCounter] = useState(1);
  const [quizTour, setQuizTour] = useState([]);
  const [answersChoice, setAnswerChoice] = useState(["yes", "no"]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [emptyAnswers, setEmptyAnswers] = useState([]);
  const [quizSent, setQuizSent] = useState(false);
  const [questionCriteria, setQuestionCriteria] = useState(null);
  const [weightsProgress, setWeightsProgress] = useState([]);
  const [quizHasAnswers, setQuizHasAnswers] = useState([]);
  const [scoreReliability, setScoreReliability] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const checkQuestionCounterValue = async (counter, questions) => {
    await axios.post(
      "https://esg-back.herokuapp.com/question/v1/insertOrder/" +
        counter +
        "/" +
        questions[counter - 1].id
    );
  };

  const checkDuplicateValue = (answersArray, questionId) => {
    // verifie dans le tableau si il n'y a pas un doublon dans le tableau associe
    const filteredArray = answersArray.filter((value) => {
      if (value) {
        return value.question_id != questionId;
      }
    });
    // renvoie le tableau sans doublon
    return filteredArray;
  };

  const getQuizAnswer = async (quizTourId, answerId) => {
    // appel a la fonction visant a recuperer une reponse selon un quiz un particulier
    const quizAnswer = await axios.get(
      "https://esg-back.herokuapp.com/answer/v1/getQuizAnswer/" +
        quizTourId +
        "/" +
        answerId
    );
    return quizAnswer.data;
  };

  const insertAnswer = async (quizTourId, questionId, answer) => {
    // insertion d'une question dans la bdd qui correspond a un quiz,une question avec le corps du contenu de la response en "body"
    try {
      const insertedAnswer = await axios.post(
        "https://esg-back.herokuapp.com/answer/v1/insert/" +
          quizTourId +
          "/" +
          questionId,
        { answer: answer }
      );
      return insertedAnswer.data;
    } catch (error) {
      console.log(error.message);
    }
    // appel a la fonction pour inserer une reponse en bdd selon le quiz, la question visé, et le contenu de la reponse qui dans ce cas est mis dans le corps de la requette
  };

  const updateAnswer = async (quizTourId, questionId, answer) => {
    // meme logique que pour la fonction insertAnswer sauf que cette fois cest pour mettre la reponse a jour.
    const updatedAnswer = await axios.post(
      "https://esg-back.herokuapp.com/updateAnswer/" +
        quizTourId +
        "/" +
        questionId,
      { answer: answer }
    );

    return updatedAnswer.data;
  };

  const getQuestionCriteria = async (questionCounter, questions) => {
    const getQuestionCriteriaById = await axios.get(
      "https://esg-back.herokuapp.com/getQuestionCriteria/" +
        questions[questionCounter - 1].id
    );
    setQuestionCriteria(getQuestionCriteriaById.data);
  };

  const getQuestionsByCategories = async () => {
    let questionsArray = [];
    const categoryList = await axios.get(
      "https://esg-back.herokuapp.com/categories/v1/getCategories"
    );

    //je recupere toutes les categories et je boucle dessus

    for (let i = 0; i < categoryList.data.length; i++) {
      // dans la boucle je recupere les questions associé a la categorie
      const getAssociatedQuestions = await axios.get(
        "https://esg-back.herokuapp.com/question/v1/getQuestions/" +
          categoryList.data[i].name
      );
      // dans une boucle imbriqué sur les questions associé aux categories, je construit le tableau questionsArray en mettant les questions associés
      for (let j = 0; j < getAssociatedQuestions.data.length; j++) {
        questionsArray.push(getAssociatedQuestions.data[j]);
      }
    }

    return questionsArray;
  };

  const getData = async () => {
    await getQuestionsByCategories();
    let questionsArray;

    const currentUser = sessionStorage.getItem("user");
    // recuperation de toutes les questions
    const checkIfAnswers = await axios.get(
      "https://esg-back.herokuapp.com/answer/v1/checkEmptyAnswers/" +
        currentUser
    );

    const checkIfTaggedQuestions = await axios.get(
      "https://esg-back.herokuapp.com/checkIfQuizHasTaggedAnswer/" + currentUser
    );
    const currentQuiz = await axios.get(
      "https://esg-back.herokuapp.com/quiz/v1/findQuizTour/" + currentUser,
      { headers: { authorization: "Bearer " + currentUserToken } }
    );

    if (sessionStorage.getItem("questionOrder")) {
      setQuestionCounter(parseInt(sessionStorage.getItem("questionOrder")));
      sessionStorage.removeItem("questionOrder");
    }
    // si il n'y a pas de responses et si le quiz n'a pas encore commencé, j'initialise les questions et je les mets dans le session storage
    if (
      checkIfAnswers.data.length == 0 &&
      checkIfTaggedQuestions.data.length == 0 &&
      currentQuiz.data.is_started == false
    ) {
      const questionList = await getQuestionsByCategories();
      sessionStorage.setItem("questions", JSON.stringify(questionList));
      questionsArray = JSON.parse(sessionStorage.getItem("questions"));
      setQuestions(questionsArray);
    } else {
      // sinon je recupere les questions existantes du quiz
      questionsArray = JSON.parse(sessionStorage.getItem("questions"));
      setQuestions(questionsArray);
    }

    // recuperation de toutes les reponses a un quiz en particulier en utilisant la variable "currentQuiz"
    const answersByQuizTour = await axios.get(
      "https://esg-back.herokuapp.com/answer/v1/getAnswers/" +
        currentQuiz.data.id
    );

    // utilisation des hooks pour etablir les etats.
    setQuizTour(currentQuiz.data);

    setIsLoading(false);

    setQuizAnswers(answersByQuizTour.data);
    await getQuestionCriteria(questionCounter, questionsArray);

    // affiche le taux de progression pour le quiz
    const getWeightsProgression = await QuizProgress(currentUser);
    setWeightsProgress(getWeightsProgression);

    const getReliability = await ScoreReliability(currentUser);
    setScoreReliability(getReliability);
  };
  // a chaque fois que l'etat du questionCounter, je refais appel a la fonction getData
  useEffect(() => {
    getData();
  }, [questionCounter]);

  if (isLoading == false) {
    return (
      <>
        <div class="progress-box-cont bg-grey">
          <div class="flex-title">
            <div class="indicator-title"> Repartition De Vos Scores</div>
          </div>
          {weightsProgress.map((element) => {
            return (
              <>
                <div class="result-box-cont space-evenly">
                  <div class="criteria">{element.code}</div>
                  <div class="score"> {element.total}%</div>
                </div>
              </>
            );
          })}
        </div>
        <hr class="w-70 m-auto" />
        <div class="progress-box-cont bg-grey">
          <div class="flex-title">
            <div class="indicator-title"> Progression</div>
          </div>
          <div class="result-box-cont percentage">
            <div class="score"> {scoreReliability}%</div>
          </div>
        </div>

        <div class="box-container">
          <div class="exit-box-cont">
            <div class="progression mt-15">
              <span class="f-bold">
                {/* affiche la question sur laquel on se trouve actuellement */}
                {questionCounter} sur {questions.length}
              </span>
            </div>

            <i
              onClick={() => {
                history.push("/");
              }}
              class="fa fa-times-circle-o fa-2x exit-box mt-10"
              aria-hidden="true"
            ></i>
          </div>
          <div class="generic-title mt-15">
            <h4> ESG</h4>
          </div>
          {emptyAnswers.length > 0 ? (
            <div class="empty-answers-cont">
              {/*
              <div class="send-anyways-cont">
                <button class="send-anyways-btn">
                  {" "}
                  <Link class="link" to="/quizresults">
                    {" "}
                    J'envoie quand meme{" "}
                  </Link>
                </button>
              </div>
              */}
              <p class="empty-answer-msg">
                {/* au cas ou il y aurai des questions vides, un message indiquant le nombres de questions non repondu s'affiche*/}
                Vous n'avez pas repondu aux questions suivantes. Si vous voulez
                quand meme envoyer votre questionnaire cliquez sur le boutons au
                dessus
              </p>
              {/* je boucle sur les questions pour afficher toutes les questions auxquelles l'utilisateur n'a pas repondu*/}
              {emptyAnswers.map((element) => {
                return (
                  <>
                    <ul class="empty-answer-list">
                      <li>
                        {" "}
                        <span class="text-red">
                          {element.question_order}{" "}
                        </span>{" "}
                      </li>
                    </ul>
                  </>
                );
              })}
            </div>
          ) : (
            <span> </span>
          )}

          <div class="question-text mt-15 h-fixed">
            <span class="f-bold question-content-text">
              {/* affichage de la question actuelle selon la valeur de l'etat counter*/}
              {questions[questionCounter - 1].content}
            </span>
          </div>
          {/*
          <div class="flex-btn-center">
            <button class="text-center stats-btn">
              {" "}
              <Link
                to={`/question-stats/${
                  questions[questionCounter - 1].id
                }/${questionCounter}`}
              >
                Statistiques Question{" "}
              </Link>{" "}
            </button>
          </div>
              */}

          <div class="button-box mt-30">
            {/* affichage des reponses possibles aux questions */}
            {answersChoice.map((element) => {
              return (
                <button
                  //au clique du bouton
                  onClick={async () => {
                    if (quizTour.is_started == false) {
                      await axios.post(
                        "https://esg-back.herokuapp.com/quiz/v1/updateQuizStarted/" +
                          quizTour.id
                      );
                    }

                    //recuperation de la question et du quiz actuelle en cours

                    const questionId = questions[questionCounter - 1].id;
                    const quizTourId = quizTour.id;
                    // mise a jour du question order
                    await checkQuestionCounterValue(questionCounter, questions);

                    // verification si il y a deja une reponse a cette question
                    let currentAnswer = await getQuizAnswer(
                      quizTourId,
                      questionId
                    );

                    // si il y a deja une reponse precendate
                    if (currentAnswer.rowCount != 0) {
                      // je mets a jour la reponse dans la bdd
                      const updatedAnswer = await updateAnswer(
                        quizTourId,
                        questionId,
                        element
                      );
                      // je cree une copie de l'etat des reponses deja existantes
                      const quizAnswersCopy = [...quizAnswers];
                      // je supprime les doublons eventuelles qui se trouverai dans le tableau en renvoyant un tableau sans doublon
                      const newAnswersArr = checkDuplicateValue(
                        quizAnswersCopy,
                        questions[questionCounter - 1].id
                      );
                      // j'ajoute la nouvelle reponse aux tableaux des reponses

                      newAnswersArr.push(updatedAnswer);

                      //j'etabli l'etat des reponses au quiz
                      setQuizAnswers(newAnswersArr);
                      // si le quiz n'est pas encore envoyé et si je suis pas sur la derniere question, je passe a la question suivante
                      if (!quizSent) {
                        if (questionCounter != questions.length) {
                          setQuestionCounter(questionCounter + 1);
                        }
                      }

                      // au cas ou la reponse n'existe pas deja pour la question visé.
                    } else {
                      // j'insere la reponse dans la bdd
                      const newAnswer = await insertAnswer(
                        quizTourId,
                        questionId,
                        element
                      );

                      const quizAnswersCopy = [...quizAnswers];
                      //j'ajoute la reponse aux tableaux des reponses
                      quizAnswersCopy[questionCounter - 1] = newAnswer;

                      // je mets a jour l'etat
                      setQuizAnswers(quizAnswersCopy);

                      // si l'utilisatuer a tenté d'envoyer la question mais que elle est vide
                      if (quizSent == true) {
                        // je recupere toutes les reponses vides au quiz sachant que le tableau changera parce ce que on est dans un evenement ou on repond a une question
                        const findUpdatedEmptyQuizAnswers = await axios.get(
                          "https://esg-back.herokuapp.com/answer/v1/emptyAnswersByQuizTour/" +
                            currentUser
                        );

                        // je mets a jour l'etat avec toutes les questions auxquelles il n'y a pas de reponse et cette question ne se trouvera logiquement plus dans ca tableau;
                        setEmptyAnswers(findUpdatedEmptyQuizAnswers.data);
                      }
                      // si il y pas deja eu une temptation de soummison du quiz j'incremente automatiquement les questions
                      if (!quizSent) {
                        if (questionCounter != questions.length) {
                          setQuestionCounter(questionCounter + 1);
                        }
                      }
                    }

                    if (questionCounter == questions.length) {
                      const getReliability = await ScoreReliability(
                        currentUser
                      );
                      setScoreReliability(getReliability);
                    }
                  }}
                  class="choice-button m-15 br-50"
                >
                  <div class="text-center"> {element} </div>
                </button>
              );
            })}
          </div>

          <div class="mt-15 progress-buttons">
            <button
              onClick={() => {
                // retour a une question precedante
                if (questionCounter > 1) {
                  setQuestionCounter(questionCounter - 1);
                }
              }}
              class="previous br-50 p-10"
            >
              <span> question precedante </span>
            </button>

            <button
              onClick={async () => {
                // si l'utilisateur clique sur le bouton question suivante, le quiz sera automatiquement commencé
                if (quizTour.is_started == false) {
                  await axios.post(
                    "https://esg-back.herokuapp.com/quiz/v1/updateQuizStarted/" +
                      quizTour.id
                  );
                }

                // si je suis pas a la derniere question j'incremente la question actuelle

                if (questionCounter != questions.length - 1) {
                  await checkQuestionCounterValue(questionCounter, questions);
                }
                if (questionCounter < questions.length) {
                  setQuestionCounter(questionCounter + 1);
                }
              }}
              class="next br-50 p-10"
            >
              <span> question suivante </span>
            </button>
          </div>
          {questionCounter == questions.length ? (
            // si je suis sur la derniere question un bouton pour envoyer le quiz s'affiche
            <div class="send-btn-cont">
              <button
                onClick={async () => {
                  // je dis que le quiz a bien ete envoyé

                  setQuizSent(true);

                  checkQuestionCounterValue(questionCounter, questions);
                  // je recupere toutes les questions auxquelles il n'y aurai potentiellement pas de reponse.
                  const emptyAnswersByQuizTour = await axios.get(
                    "https://esg-back.herokuapp.com/answer/v1/emptyAnswersByQuizTour/" +
                      currentUser
                  );

                  // si il n'y a pas de reponse vide je redigere pour voir les resultats
                  if (emptyAnswersByQuizTour.data.length == 0) {
                    history.push("/quiz/results");
                  }
                  // sinon je mets l'etat a jour avec toutes les questions vides auxquelles je n'aurai potentiellement pas repondu.
                  setEmptyAnswers(emptyAnswersByQuizTour.data);
                }}
                class="send-btn"
              >
                Envoyer Mon Quiz
              </button>
            </div>
          ) : (
            <span></span>
          )}
          {/* si j'ai envoyé le quiz mets que il y a des reponses vides je fait en sorte que le bouton pour envoyer s'affiche partout sur le quiz en appliquant la meme logique q'avant*/}
          {quizSent == true && questionCounter != questions.length ? (
            <div class="send-btn-cont">
              <button
                onClick={async () => {
                  setQuizSent(true);

                  const emptyAnswersByQuizTour = await axios.get(
                    "https://esg-back.herokuapp.com/answer/v1/emptyAnswersByQuizTour/" +
                      currentUser
                  );

                  if (emptyAnswersByQuizTour.data.length == 0) {
                    history.push("/quiz/results");
                  }
                  setEmptyAnswers(emptyAnswersByQuizTour.data);
                }}
                class="send-btn"
              >
                Envoyer Mon Quiz
              </button>
            </div>
          ) : (
            <span> </span>
          )}
          <div class="answer-text-cont">
            {quizAnswers.map((element) => {
              if (element) {
                if (questions[questionCounter - 1].id == element.question_id) {
                  return (
                    // affichage de la reponse a la question en particulier.
                    <div class="answer-text">
                      Your Answer :{element.content}{" "}
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
      </>
    );
  } else {
    return <div> The page is loading</div>;
  }
};

export default PlayNew;
