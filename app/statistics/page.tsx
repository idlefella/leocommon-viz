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
import EchartsGeoMapSensors from "../shared/echarts/sensormap";
import { EchartTimeline } from "../shared/echarts/timeline";
import {
  Client,
  FrameStat,
  JobCountWithTime,
  PacketWithTime,
  Service,
} from "../shared/service";
import Body from "../shared/tabler/body";
import Header from "../shared/tabler/header";
import { EchartPieChart } from "../shared/echarts/piechart";

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
  }, []);

  return (
    <>
      <Header title="Statistics" pretitle="LeoCommon Explorer"></Header>
      <Body>
        <div className="container-xl">
          <div className="row">
            <div className="col-12">
              <Card2 title="Sensor map">
                <EchartsGeoMapSensors clients={clients}></EchartsGeoMapSensors>
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
          </div>
        </div>
      </Body>
    </>
  );
}
