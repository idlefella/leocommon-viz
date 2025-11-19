"use client";

import { IconLinkPlus } from "@tabler/icons-react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";
import Service from "../shared/service";

import { PieChart } from "echarts/charts";

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
]);

export default function Job() {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState("");
  const [jobData, setJobData] = useState(null);
  const [jobIridiumIra, setJobIridiumIra] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    Service.getDatasets().then((response) => {
      setJobs(response);
    });
  }, []);

  useEffect(() => {
    if (job) {
      Service.getDfInfo(job).then((response) => {
        setJobData(response);
      });
      Service.getDf(job).then((response) => {
        const data = Object.values(
          response.reduce((acc, { frame_type }) => {
            if (!acc[frame_type]) {
              acc[frame_type] = { name: frame_type, value: 1 };
            } else {
              acc[frame_type].value += 1;
            }
            return acc;
          }, {})
        );
        updateChartData(data);
      });
    }
  }, [job]);

  const updateChartData = (data) => {
    setChartData({
      title: {
        text: "Frame types",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Frame types",
          type: "pie",
          radius: "50%",
          data: data,
          // emphasis: {
          //   itemStyle: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: "rgba(0, 0, 0, 0.5)",
          //   },
          // },
        },
      ],
    });
  };

  return (
    <div>
      <div className="page-header d-print-none" aria-label="Page header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">LeoCommon Explorer</div>
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
          <div className="row row-cards">
            <div className="col">
              <form action="#" className="card">
                <div className="card-header">
                  <h4 className="card-title">Select Job</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="job">Job</label>
                      <select
                        className="form-select"
                        onChange={(event) => setJob(event.target.value)}
                      >
                        {jobs.map((value, index) => (
                          <option value={value} key={index}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {jobData && (
            <div className="row row-cards mt-3">
              <div className="col">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Example data</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-vcenter">
                        <thead>
                          <tr key="tr1">
                            {jobData.columns.map((value, index) => (
                              <th key={index}>{value}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {jobData.head.map((value, index) => (
                            <tr key={index}>
                              {jobData.columns.map((value, index) => (
                                <td key={index}>
                                  {jobData.head[index][value]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card">
                  <div className="card-header">Message type</div>
                  <div className="card-body">
                    {chartData && (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={chartData}
                        //notMerge={true}
                        //lazyUpdate={true}
                        //theme={"theme_name"}
                        //onChartReady={this.onChartReadyCallback}
                        //onEvents={EventsDict}
                        //opts={}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
