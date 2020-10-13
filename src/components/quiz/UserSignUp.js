import React, { Component, Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "../../styles/components/signup.scss";

const UserSignUp = () => {
  let history = useHistory();

  let currentUser = sessionStorage.getItem("user");

  console.log("here is the current user");
  console.log(currentUser);

  let currentUserToken = sessionStorage.getItem("token");
  //definition des etats, dans ce cas un email et un message d'erruer
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  return (
    <>
      <div class="mt-150"></div>
      <div class="form-container">
        <h4 class="signup-title">
          {" "}
          Commencer Ou reprener votre questionnaire{" "}
        </h4>
        <form method="post" action="/" class="form">
          <div class="btn-cont-signup">
            <button
              onClick={async (event) => {
                // clique sur le bouton si l'utilisateur veux commencer un nouveau quiz
                event.preventDefault();
                await axios.post(
                  "https://esg-back.herokuapp.com/quiz/v1/insertQuizTour/" +
                    currentUser,
                  {},
                  { headers: { authorization: "Bearer " + currentUserToken } }
                );

                history.push("/play/quiz");

                // est ce que l'email a bien ete saisi dans le formulaire?
              }}
              class="submit-button"
            >
              Je commence un nouveau quiz
            </button>
            <button
              onClick={async (event) => {
                // clique sur le bouton indiquant que l'utilisatuer veux reprendre son dernier quiz en cours
                event.preventDefault();
                const quizTour = await axios.get(
                  "https://esg-back.herokuapp.com/quiz/v1/findQuizTour/" +
                    currentUser,
                  { headers: { authorization: "Bearer " + currentUserToken } }
                );
                if (quizTour.data) {
                  history.push("/play/quiz");
                } else {
                  await axios.post(
                    "https://esg-back.herokuapp.com/quiz/v1/insertQuizTour/" +
                      currentUser,
                    {},
                    { headers: { authorization: "Bearer " + currentUserToken } }
                  );
                }
                // meme logique q'au dessus saug que cette fois au lieu de creer un nouveau quiz, il reprendra le dernier quiz en cours.
              }}
              class="submit-button"
            >
              Je reprends un quiz en cours
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserSignUp;
