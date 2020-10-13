import React, { Component, Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams, Redirect } from "react-router-dom";
import axios from "axios";
import "../../styles/components/connexion.scss";

const Connexion = () => {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [userSet, setUserSet] = useState(false);
  return (
    <>
      <div class="box-container">
        <div class="fl-20 fs-12 text-center"> Formulaire De Connexion</div>
        <div class="signup-form">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              console.log("form is submitted");

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

              const getUserInfo = await axios.post(
                "https://esg-back.herokuapp.com/user/v1/authentication",
                { email: email, password: password }
              );
              if (getUserInfo.data.id) {
                console.log("uer is found");
                sessionStorage.setItem("user", getUserInfo.data.id);
                sessionStorage.setItem("token", getUserInfo.data.token);
                //setUserSet(true);
                history.push("/");
                window.location.reload();
              } else {
                const errorMessageCopy = [...errorMessages];
                if (errorMessageCopy.indexOf(getUserInfo.data.message) == -1) {
                  errorMessageCopy.push(getUserInfo.data.message);
                  setErrorMessages(errorMessageCopy);
                  return false;
                }
              }
            }}
            method="post"
            action=""
          >
            <div class="form-group">
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
                <label for="email">
                  <div class="text-center label">Votre Mot de Passe</div>
                </label>{" "}
              </div>
              <input
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type="password"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Renter Un Email"
              />
            </div>

            <div class="flex-inscription-btn">
              <button
                type="submit"
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

export default Connexion;
