import { IconLinkPlus, IconSatellite } from "@tabler/icons-react";
import Card from "../shared/tabler/card";

export default function Job() {
  return (
    <div>
      <div className="page-header d-print-none" aria-label="Page header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">LeoComm Explorer</div>
              <h2 className="page-title">Jobs</h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <a
                  href="#"
                  className="btn btn-primary btn-5 d-none d-sm-inline-block"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-report"
                >
                  <IconLinkPlus />
                  Create new measurement
                </a>
                <a
                  href="#"
                  className="btn btn-primary btn-6 d-sm-none btn-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-report"
                  aria-label="Create new report"
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-sm-6 col-lg-3">
              <Card
                subheader="Observed satellites"
                content="21'131"
                icon={<IconSatellite></IconSatellite>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
