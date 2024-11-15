import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import Spinner from "./Spinner";
import Alert from "./Alert";
import Modal from "react-bootstrap/Modal";

const MainComponent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [response, setResponse] = useState(null);
  const [responseDetail, setResponseDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef(null);
  const [show, setShow] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRef = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setError(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleRef);

    return () => {
      document.removeEventListener("click", handleRef);
    };
  }, []);

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

      setResponse(data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
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

      setResponse(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleAsteroidDetail = async (id) => {
    setModalLoading(true)
    setShow(true);
    const url = "http://222.165.225.218:1313/neo/lookup/" + id;

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

      setResponseDetail(data.data);
      setModalLoading(false)
    } catch (error) {
      setError(error.message);
      setModalLoading(false)
    }
  };

  return (
    <div className="container-fluid pt-4 px-4" ref={componentRef}>
      {error != null ? <Alert message={error} /> : null}
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
        {show && (
          modalLoading ? 
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-secondary">
              
            </Modal.Header>
            <Modal.Body className="bg-secondary col-sm-12 col-xl-12 text-center">
              <Spinner/>
            </Modal.Body>
          </Modal> :           <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-secondary">
              <Modal.Title>{responseDetail.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-secondary col-sm-12 col-xl-12 text-start">
              <div className="bg-secondary rounded h-100">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-4"></h6>
                  <div>
                    <span
                      className={`badge ${
                        responseDetail.isHazardous ? "bg-danger" : "bg-success"
                      } me-1`}
                    >
                      {responseDetail.isHazardous
                        ? "Hazardous"
                        : "Not Hazardous"}
                    </span>
                  </div>
                </div>
                <dl className="row mb-0 mt-2">
                  <dt className="col-sm-4">Diameter</dt>
                  <dd className="col-sm-8">
                    {formatDiameter(responseDetail.diameter.min)} m -{" "}
                    {formatDiameter(responseDetail.diameter.max)} m
                  </dd>
                </dl>
                <table className="table table-striped mt-5 text-center">
                  <thead>
                    <tr>
                      <th scope="col">Approach Date (UTC)</th>
                      <th scope="col">Distance</th>
                      <th scope="col">Velocity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseDetail.approachData.map((e, id) => {
                      return (
                        <tr key={id}>
                          <td>{e.closeApproachDate}</td>
                          <td>{formatNum(e.distanceEarthKm)} km</td>
                          <td>{formatNum(e.relativeVelocityKph)} km/h</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-secondary">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClose}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        )}
        {response && !loading ? (
          <Card data={response} getDetail={handleAsteroidDetail} />
        ) : loading ? (
          <Spinner />
        ) : null}
      </div>
    </div>
  );
};

const formatDiameter = (diameterKm) => {
  const diameterMeters = diameterKm * 1000;
  return diameterMeters.toFixed(2);
};

const formatNum = (num) => {
  const numericDistance = parseFloat(num);
  return numericDistance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export default MainComponent;
