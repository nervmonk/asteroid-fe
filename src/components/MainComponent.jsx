import React, { useState, useEffect } from "react";
import Card from "./Card";
import Spinner from "./Spinner";

const MainComponent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    $("#start-date").datepicker({
      dateFormat: "yy-mm-dd",
      onSelect: function (selectedDate) {
        setStartDate(selectedDate);
        $("#end-date").datepicker("option", "minDate", selectedDate);
      },
    });

    $("#end-date").datepicker({
      dateFormat: "yy-mm-dd",
      onSelect: function (selectedDate) {
        setEndDate(selectedDate);
        $("#start-date").datepicker("option", "maxDate", selectedDate);
      },
    });
  });

  const handlePostRequest = async () => {
    setLoading(true);
    const url = "http://222.165.225.218:1313/neo/feed";
    const requestData = {
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);

      setResponse(data.data); // Store the response data in the state
      setLoading(false);
    } catch (error) {
      //   setError(error.message); // Handle any errors
      console.log(error.message);
      setLoading(false);
    }
  };

  const handleTop2023 = async () => {
    setLoading(true);
    const url = "http://222.165.225.218:1313/top-10/2023";

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);

      setResponse(data.data); // Store the response data in the state
      setLoading(false);
    } catch (error) {
      //   setError(error.message); // Handle any errors
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="row g-4">
        <div className="bg-secondary rounded h-100 p-4 my-4">
          <h3 className="mb-4 text-white">
            Find the Top 10 Asteroids Closest to Earth within a Range of Time
          </h3>
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="date" className="form-control" id="start-date" />
                  <label htmlFor="start-date">Start Date</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="date" className="form-control" id="end-date" />
                  <label htmlFor="end-date">End Date</label>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column align-items-center mt-2">
              {!loading ? (
                <button
                  type="button"
                  className="btn btn-success px-5 mb-2"
                  onClick={handlePostRequest}
                >
                  Find In Range
                </button>
              ) : (
                <button
                  className="btn btn-success px-5 mb-2"
                  type="button"
                  disabled
                >
                  <span className="spinner-border spinner-border-sm"></span>
                  Loading...
                </button>
              )}
              {!loading ? (
                <button
                  type="button"
                  className="btn btn-info px-5 mt-2"
                  onClick={handleTop2023}
                >
                  Top 2023 Asteroids
                </button>
              ) : (
                <button
                  className="btn btn-info px-5 mt-2"
                  type="button"
                  disabled
                >
                  <span className="spinner-border spinner-border-sm"></span>
                  Loading...
                </button>
              )}
            </div>
          </form>
        </div>
        {response && !loading ? (
          <Card data={response} />
        ) : loading ? (
          <Spinner />
        ) : null}
        {/* {loading && <Spinner />} */}
      </div>
    </div>
  );
};

export default MainComponent;
