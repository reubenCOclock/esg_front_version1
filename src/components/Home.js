import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Home = () => (
  <Fragment>
    <Helmet>
      <title>Home - ESG App</title>
    </Helmet>
    <div id="home">
      <section>
        <div style={{ textAlign: "center" }}>
          <span className="mdi mdi-checkbox-marked cube"></span>
        </div>
        <h1>RÉVOLUTION ESG</h1>
        {sessionStorage.getItem("user") ? (
          <div className="play-button-container">
            <ul>
              <li>
                <Link className="play-button" to="/play/instructions">
                  Commencer
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="auth-container">
            <Link to="/signin" className="auth-buttons" id="login-button">
              Connexion
            </Link>
            <Link to="/signup" className="auth-buttons" id="signup-button">
              S'inscrire
            </Link>
          </div>
        )}
      </section>
    </div>
  </Fragment>
);

export default Home;
