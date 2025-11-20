"use client";

import { useEffect, useRef, useState } from "react";
import Visualization from "../satellite-viz/components/visualization";

import { newEpoch } from "../satellite-viz/lib/shared-epoch.js";

import Service from "../shared/service";
import { Card2 } from "../shared/tabler/card";

export default function Globe() {
  const [satData, setSatData] = useState([]);
  const epoch = useRef(newEpoch(new Date()));
  const clockSpeed = 30;
  const followId = "";
  const cameraMode = "INERTIAL";
  const lighting = "OFF";
  const setSelectId = "";
  const [tickrate, setTickrate] = useState(1000 / 90);
  const threadCount = 1;

  // Own variables
  const [satelliteSystem, setStatelliteSystem] = useState("all");

  const loadData = () => {
    useEffect(() => {
      Service.getTLEs(satelliteSystem).then((result) => {
        setSatData(result);
      });
    }, [satelliteSystem]);
  };

  loadData();

  return (
    <div className="page-wrapper" style={{ position: "absolute" }}>
      <div className="page-header d-print-none" aria-label="Page header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">LeoComm Explorer</div>
              <h2 className="page-title">Globe</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            <div className="col">
              <Card2 title="Filter satellites">
                <p className="card-subtitle">
                  Select the satellite system to show.
                </p>
                <select
                  className="form-select"
                  onChange={(event) => setStatelliteSystem(event.target.value)}
                >
                  <option>all</option>
                  <option>iridium</option>
                  <option>starlink</option>
                  <option>orbcomm</option>
                  <option>oneweb</option>
                  <option>globalstar</option>
                  <option>other</option>
                </select>
              </Card2>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Legend</h3>
                  <div className="badges-list">
                    <span className="badge bg-red text-red-fg">Iridum</span>
                    <span className="badge bg-blue text-blue-fg">Starlink</span>
                    <span className="badge bg-cyan text-cyan-fg">Orbcomm</span>
                    <span className="badge bg-orange text-orange-fg">
                      Oneweb
                    </span>
                    <span className="badge bg-green text-green-fg">
                      Globalstar
                    </span>
                    <span className="badge bg-grey text-grey-fg">Other</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <div className="card p-0">
                <div className="card-body p-0 ">
                  <Visualization
                    data={satData}
                    epoch={epoch.current}
                    clockSpeed={clockSpeed}
                    followId={followId}
                    cameraMode={cameraMode}
                    lighting={lighting}
                    setSelectId={setSelectId}
                    tickrate={tickrate}
                    threadCount={threadCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
