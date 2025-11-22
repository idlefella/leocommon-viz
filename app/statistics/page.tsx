"use client";
import * as echarts from "echarts/core";
import { Card2 } from "../shared/tabler/card";

import { BarChart, PieChart } from "echarts/charts";

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useState } from "react";
import { EchartPieChart } from "../shared/echarts/piechart";
import { EchartBarChart } from "../shared/echarts/barchart";
import EchartsGeoMapSensors, { Satellite } from "../shared/echarts/sensormap";
import { EchartTimeline } from "../shared/echarts/timeline";
import {
  Client,
  FeatureCollection,
  FrameStat,
  JobCountWithTime,
  PacketWithTime,
  Service,
} from "../shared/service";
import Body from "../shared/tabler/body";
import Header from "../shared/tabler/header";

import * as satellitejs from "satellite.js";
import { time } from "console";
import { EchartHeatmapChart } from "../shared/echarts/heatmap";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  PieChart,
  CanvasRenderer,
  LegendComponent,
]);

export default function Statistics() {
  const [clients, setClients] = useState<Client[]>([]);
  const [networkPacketsOverTime, setNetworkPacketsOverTime] = useState<
    PacketWithTime[]
  >([]);
  const [numberOfJobsOverTime, setNumberOfJobsOverTime] = useState<
    JobCountWithTime[]
  >([]);
  const [numberOfPackets, setNumberOfPackets] = useState<FrameStat[]>([]);
  const [coverageMaps, setCoverageMaps] = useState<FeatureCollection | null>(
    null
  );
  const [tles, setTles] = useState<any[]>([]);
  const [satellites, setSatellites] = useState<Satellite[]>([]);

  let timerId: any = null;

  const convertSatToLatLong = (sat: any) => {
    const gmst = satellitejs.gstime(new Date());
    const positionAndVelocity = satellitejs.propagate(sat.satrec, new Date());
    const lonLat = satellitejs.eciToGeodetic(
      positionAndVelocity?.position!,
      gmst
    );
    return {
      name: sat.name,
      longitude: satellitejs.degreesLong(lonLat.longitude),
      latitude: satellitejs.degreesLat(lonLat.latitude),
    };
  };

  // Map with sensors
  useEffect(() => {
    Service.getClients().then((response) => {
      setClients(response);
    });
    Service.getNetworkPacketsOverTime().then((response) => {
      setNetworkPacketsOverTime(response);
    });
    Service.getNumberOfJobsOverTime().then((response) => {
      setNumberOfJobsOverTime(response);
    });
    Service.getNumberOfJobsOverTime().then((response) => {
      setNumberOfJobsOverTime(response);
    });
    Service.getNumberOfPackets().then((response) => {
      setNumberOfPackets(response);
    });
    Service.getCoverageOfClient().then((response) => {
      setCoverageMaps(response);
    });
    Service.getTLEs("IRIDIUM").then((response) => {
      // Parse two lines to satrec
      setTles(response);
      setSatellites(response.map(convertSatToLatLong));
    });
  }, []);

  useEffect(() => {
    timerId = setInterval(() => {
      setSatellites(tles.map(convertSatToLatLong));
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  });

  return (
    <>
      <Header title="Statistics" pretitle="LeoCommon Explorer"></Header>
      <Body>
        <div className="container-xl">
          <div className="row">
            <div className="col-12">
              <Card2 title="Sensor map">
                <EchartsGeoMapSensors
                  clients={clients}
                  coverageMaps={coverageMaps}
                  satellites={satellites}
                ></EchartsGeoMapSensors>
              </Card2>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <Card2 title="Packets over time">
                <EchartTimeline
                  data={networkPacketsOverTime.map((item) => [
                    item.year_month,
                    item.count,
                  ])}
                ></EchartTimeline>
              </Card2>
            </div>
            <div className="col-6">
              <Card2 title="Jobs over time">
                <EchartTimeline
                  data={numberOfJobsOverTime.map((item) => [
                    `${item.year}-${item.month}`,
                    item.unique_job_count,
                  ])}
                ></EchartTimeline>
              </Card2>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <Card2 title="Frame types">
                <EchartPieChart
                  data={numberOfPackets.map((item) => {
                    return { name: item.frame_type, value: item.count };
                  })}
                ></EchartPieChart>
              </Card2>
            </div>
            <div className="col-6">
              <Card2 title="Count of Packets">
                <EchartBarChart
                  data={numberOfPackets.map((item) => {
                    return { name: item.frame_type, value: item.count };
                  })}
                ></EchartBarChart>
              </Card2>
            </div>
          </div>
          <div className="row nt-3">
            <div className="col-6">
              <Card2 title="Number of previous Jobs">
                <EchartHeatmapChart
                  data={numberOfJobsOverTime.map((item) => {
                    return { month: item.month, year: item.year, value: item.unique_job_count };
                  })}
                ></EchartHeatmapChart>
              </Card2>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}
