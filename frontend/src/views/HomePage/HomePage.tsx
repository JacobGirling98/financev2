import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "../../Routes";
import "./HomePage.scss";

const HomePage: React.FC = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          Finance App
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="/newmoney">
                New Money
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/viewmoney">
                View Money
              </a>
            </li>
          </ul>
        </div>
        <div className="collapse navbar-collapse justify-content-end">
          <button
            className="btn btn-primary"
            type="button"
          >
            Sync Data
          </button>
        </div>
      </nav>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </>
  );
};

export default HomePage;
