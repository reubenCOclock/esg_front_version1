import React, { useState, useEffect, Component } from "react";
import { Helmet } from "react-helmet";
import M from "materialize-css";
import { Link, Router, useHistory } from "react-router-dom";
import classnames from "classnames";
import axios from "axios";

import questions from "../../questions.json";
import isEmpty from "../../utils/is-empty";

import correctNotification from "../../assets/audio/correct-answer.mp3";
import wrongNotification from "../../assets/audio/wrong-answer.mp3";
import buttonSound from "../../assets/audio/button-sound.mp3";
import "../../styles/components/header.scss";

const Header = () => {
  let currentUser = sessionStorage.getItem("user");
  let history = useHistory();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserObj, setCurrentUserObj] = useState("");
  const [roleObj, setRoleObj] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [refresh, setRefresh] = useState(null);

  const getData = async () => {
    setIsLoading(false);
    const findUser = await axios.get(
      "https://esg-back.herokuapp.com/user/v1/findUserById/" + currentUser
    );
    setCurrentUserObj(findUser.data);

    //setRoleObj(findRole.data);
  };

  useEffect(() => {
    getData();
  }, [refresh]);
  //console.log("here is the session storage information");
  //console.log(sessionStorage.getItem("user"));

  if (isLoading == false) {
    if (currentUserObj.id) {
      //setRefresh(true);
      return (
        <>
          <header class="header">
            <div class="flex-items-header">
              <div class="esg-title"> ESG Revolution</div>

              <ul class="flex-li-items">
                <li>
                  <Link class="link" to="/">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link class="link" to="/play/instructions">
                    Je Teste Mon Profil
                  </Link>
                </li>

                <li>
                  <Link class="link" to="/about">
                    A propos
                  </Link>
                </li>

                <li>
                  <Link
                    onClick={() => {
                      sessionStorage.clear();
                      history.push("/");
                      setRefresh(true);
                    }}
                    class="link"
                    to="/"
                  >
                    Decconexion
                  </Link>
                </li>
              </ul>
            </div>
          </header>

          <header class="header-responsive">
            <div class="flex-items-header-responsive">
              <div class="esg-title"> ESG Revolution</div>
              <div
                class="topnav"
                onClick={() => {
                  console.log("hamburger menu clicked");
                  console.log(menuVisible);
                  if (menuVisible == false) {
                    setMenuVisible(true);
                  } else {
                    setMenuVisible(false);
                  }
                }}
              >
                {menuVisible ? (
                  <>
                    <a
                      href="javascript:void(0);"
                      class="icon"
                      onclick="myFunction()"
                    >
                      <i class="fa fa-bars"></i>
                    </a>

                    <div style={{ display: "block" }} id="myLinks visible">
                      <ul class="link-list">
                        <li>
                          <Link class="link" to="/">
                            Accueil
                          </Link>
                        </li>
                        <li>
                          <Link class="link" to="/play/instructions">
                            Je Teste Mon Profil
                          </Link>
                        </li>

                        <li>
                          <Link class="link" to="/about">
                            A propos
                          </Link>
                        </li>

                        <li>
                          <Link
                            onClick={() => {
                              sessionStorage.clear();
                              history.push("/");
                              setCurrentUserObj("");
                              //window.location.reload(true);
                            }}
                            class="link"
                            to="/"
                          >
                            Decconexion
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href="javascript:void(0);"
                      class="icon"
                      onclick="myFunction()"
                    >
                      <i class="fa fa-bars"></i>
                    </a>

                    <div style={{ display: "none" }} id="myLinks hidden">
                      <a href="#news">News</a>
                      <a href="#contact">Contact</a>
                      <a href="#about">About</a>
                    </div>
                  </>
                )}

                {/*<!-- Navigation links (hidden by default) -->*/}

                {/*<!-- "Hamburger menu" / "Bar icon" to toggle the navigation links -->*/}
              </div>
            </div>
          </header>
        </>
      );
    } else {
      return (
        <>
          <header class="header">
            <div class="flex-items-header">
              <div class="esg-title"> ESG Revolution</div>

              <ul class="flex-li-items">
                <li>
                  <Link class="link" to="/">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link class="link" to="/signup">
                    Inscription
                  </Link>
                </li>

                <li>
                  <Link class="link" to="/signin">
                    Connexion
                  </Link>
                </li>

                <li>
                  <Link class="link" to="/about">
                    A propos
                  </Link>
                </li>
              </ul>
            </div>
          </header>

          <header class="header-responsive">
            <div class="flex-items-header-responsive">
              <div class="esg-title"> ESG Revolution</div>
              <div
                class="topnav"
                onClick={() => {
                  console.log("hamburger menu clicked");
                  console.log(menuVisible);
                  if (menuVisible == false) {
                    setMenuVisible(true);
                  } else {
                    setMenuVisible(false);
                  }
                }}
              >
                {menuVisible ? (
                  <>
                    <a
                      href="javascript:void(0);"
                      class="icon"
                      onclick="myFunction()"
                    >
                      <i class="fa fa-bars"></i>
                    </a>

                    <div style={{ display: "block" }} id="myLinks visible">
                      <ul class="link-list">
                        <li>
                          <Link class="link" to="/">
                            Accueil
                          </Link>
                        </li>
                        <li>
                          <Link class="link" to="/signin">
                            Connexion
                          </Link>
                        </li>
                        <li>
                          <Link class="link" to="/play/instructions">
                            Inscription
                          </Link>
                        </li>

                        <li>
                          <Link class="link" to="/about">
                            A propos
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href="javascript:void(0);"
                      class="icon"
                      onclick="myFunction()"
                    >
                      <i class="fa fa-bars"></i>
                    </a>

                    <div style={{ display: "none" }} id="myLinks hidden">
                      <a href="#news">News</a>
                      <a href="#contact">Contact</a>
                      <a href="#about">About</a>
                    </div>
                  </>
                )}

                {/*<!-- Navigation links (hidden by default) -->*/}

                {/*<!-- "Hamburger menu" / "Bar icon" to toggle the navigation links -->*/}
              </div>
            </div>
          </header>
        </>
      );
    }
  } else {
    return <div> Page Is Loading</div>;
  }
};

export default Header;
