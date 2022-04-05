import axios from "axios";
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "../../Routes";
import "./HomePage.scss";
import { BASE_URL } from "../../utils/api-urls";
import Spinner from "../../components/Spinner";
import useFormOptions from "../../hooks/useFormOptions";
import { useFormOptionsContext } from "../../context/FormOptions";

const HomePage: React.FC = () => {
  
  const [loading, setLoading] = useState<Boolean>(false);

  const { setDescriptions } = useFormOptionsContext();

  useFormOptions();

  const handleSyncData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true)
    await axios.get(`${BASE_URL}sync_data`)
    setLoading(false)
  }
  
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
            onClick={handleSyncData}
          >
            Sync Data
          </button>
        </div>
      </nav>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      {loading && <Spinner />}
    </>
  );
};

export default HomePage;

