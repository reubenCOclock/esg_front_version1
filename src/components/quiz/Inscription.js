import React, { Component, Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/components/inscription.scss";
import QuizProgress from "./QuizProgress";
import ScoreReliability from "./ScoreReliability";

const Inscription = () => {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  return (
    <>
      <div class="box-container">
        <div class="fl-20 fs-12 text-center"> Formulaire D'inscription</div>
        <div class="signup-form">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              console.log("form is submitted");
              const getUserRole = await axios.get(
                "http://localhost:3000/role/v1/getUserRole"
              );

              if (!email) {
                const errorMessageCopy = [...errorMessages];
                if (
                  errorMessageCopy.indexOf(
                    "viuellez bien saisir votre email"
                  ) == -1
                ) {
                  errorMessageCopy.push("viuellez bien saisir votre email");
                  setErrorMessages(errorMessageCopy);
                }

                return false;
              }

              if (!password) {
                const errorMessageCopy = [...errorMessages];
                if (
                  errorMessageCopy.indexOf(
                    "vieullez bien saisir un mot de passe"
                  ) == -1
                ) {
                  errorMessageCopy.push("vieullez bien saisir un mot de passe");
                  setErrorMessages(errorMessageCopy);
                }

                return false;
              }

              console.log("get user role");

              const newUser = await axios.post(
                "http://localhost:3000/user/v1/insert",
                {
                  email: email,
                  role: getUserRole.data.id,
                  password: password,
                }
              );

              if (newUser.data.email) {
                const errorMessageCopy = [...errorMessages];
                errorMessageCopy.length = 0;
                setErrorMessages(errorMessageCopy);
                setWelcomeMessage(
                  "Bienvenue Chez ESG, vous pouvez maintenant vous inscrire pour prendre le quiz"
                );
              } else {
                const errorMessageCopy = [...errorMessages];

                if (errorMessageCopy.indexOf("email deja existant") == -1) {
                  errorMessageCopy.push("email deja existant");
                  setErrorMessages(errorMessageCopy);
                }

                return false;
              }
            }}
            method="post"
            action=""
          >
            <div class="form-group">
              {welcomeMessage ? (
                <div class="welcome-message text-center">
                  {" "}
                  <span> {welcomeMessage}</span>
                </div>
              ) : (
                <span></span>
              )}
              {errorMessages ? (
                <ul class="flex-li-center">
                  {errorMessages.map((element) => {
                    return (
                      <li class="error-msg">
                        {" "}
                        <span>{element}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <span></span>
              )}
              <div class="flex-label">
                <label for="email">
                  <div class="text-center label">Votre Adresse Mail</div>
                </label>{" "}
              </div>

              <input
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Renter Un Email"
              />
            </div>

            <div class="form-group">
              <div class="flex-label">
                <label for="exampleInputPassword1">
                  <div class="text-center label">Choisir Un Mot De Passe </div>
                </label>
              </div>

              <input
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Renter Un Mot de Passe"
              />
            </div>
            <div class="flex-inscription-btn">
              <button
                type="submit "
                class="btn btn-primary submit-inscription-btn"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Inscription;
