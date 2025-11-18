"use client";

import { useEffect, useRef, useState } from "react";
import Visualization from "../satellite-viz/components/visualization";

import { newEpoch } from "../satellite-viz/lib/shared-epoch.js";

import Service from "../shared/service";

export default function Globe() {
  //const satData = data;
  const [satData, setSatData] = useState([]);
  const epoch = useRef(newEpoch(new Date()));
  const clockSpeed = 30;
  const followId = "";
  const cameraMode = "INERTIAL";
  const lighting = "OFF";
  const setSelectId = "";
  const [tickrate, setTickrate] = useState(1000 / 90);
  const threadCount = 100;

  useEffect(() => {
    Service.getTLEs().then((result) => {
      setSatData(result);
    });
  }, []);

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
      <div className="container-xl">
        <div className="row">
          <div className="col-lg-12">
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
  );
}
