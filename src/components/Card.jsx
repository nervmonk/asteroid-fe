const formatNum = (num) => {
  const numericDistance = parseFloat(num);
  return numericDistance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

const formatDiameter = (diameterKm) => {
  const diameterMeters = diameterKm * 1000;
  return diameterMeters.toFixed(2);
};

const Card = ({ data, getDetail }) => {
  return data.map((e, idx) => {
    return (
      <div key={e.id} className="col-sm-12 col-xl-6 text-start">
        <div className="bg-secondary rounded h-100 p-4">
          <div className="d-flex justify-content-between">
            <h6 className="mb-4">#{idx + 1}</h6>
            <div>
              <span
                className={`badge ${
                  e.isHazardous ? "bg-danger" : "bg-success"
                } me-1`}
              >
                {e.isHazardous ? "Hazardous" : "Not Hazardous"}
              </span>
            </div>
          </div>
          <dl className="row mb-0">
            <dt className="col-sm-4">Name</dt>
            <dd className="col-sm-8">{e.name}</dd>

            <dt className="col-sm-4">Approach Date</dt>
            <dd className="col-sm-8">{e.approachDate} UTC</dd>

            <dt className="col-sm-4">Distance from earth</dt>
            <dd className="col-sm-8">{formatNum(e.distanceFromEarthKm)} km</dd>

            <dt className="col-sm-4">Relative velocity</dt>
            <dd className="col-sm-8">
              {formatNum(e.relativeVelocityKph)} km/h
            </dd>

            <dt className="col-sm-4">Diameter</dt>
            <dd className="col-sm-8">
              {formatDiameter(e.diameter.min)} m -{" "}
              {formatDiameter(e.diameter.max)} m
            </dd>
          </dl>
          <button className="btn btn-warning mt-3" onClick={() => getDetail(e.id)}>More Info</button>
        </div>
      </div>
    );
  });
};

export default Card;
