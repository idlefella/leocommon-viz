"use client";
import { IconPlus, IconSatellite } from "@tabler/icons-react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import Card from "../shared/tabler/card";

import { BarChart, PieChart } from "echarts/charts";

import {
  GridComponent,
  TitleComponent,
  TooltipComponent
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  PieChart,
  CanvasRenderer,
]);

export default function Statistics() {
  const barchart_option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
      },
    ],
  };

  const piechart_option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Number of Satellites",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Iridium" },
          { value: 735, name: "Orbcomm" },
          { value: 580, name: "Globalstar" },
          { value: 484, name: "Starlink" },
        ],
      },
    ],
  };

  return (
    <div className="page-wrapper">
      <div className="page-header d-print-none" aria-label="Page header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">LeoComm Explorer</div>
              <h2 className="page-title">Statistics</h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <a
                  href="#"
                  className="btn btn-primary btn-5 d-none d-sm-inline-block"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-report"
                >
                  <IconPlus />
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
            <div className="col-lg-3">
              <Card
                subheader="Observed satellites"
                content="21'131"
                icon={<IconSatellite></IconSatellite>}
              />
            </div>
            <div className="col-lg-3">
              <Card
                subheader="Blablabla"
                content="21'131"
                icon={<IconSatellite></IconSatellite>}
              />
            </div>
            <div className="col-lg-3">
              <Card
                subheader="Blablabla test"
                content="21'131"
                icon={<IconSatellite></IconSatellite>}
              />
            </div>
            <div className="col-lg-3">
              <Card
                subheader="Observed satellites"
                content="21'131"
                icon={<IconSatellite></IconSatellite>}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="subheader">cool barchart</div>
                  <ReactEChartsCore
                    echarts={echarts}
                    option={barchart_option}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="subheader">cool barchart</div>
                  <ReactEChartsCore
                    echarts={echarts}
                    option={piechart_option}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
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
