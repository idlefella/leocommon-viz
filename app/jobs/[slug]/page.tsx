"use client";

import { IconLinkPlus } from "@tabler/icons-react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";
import Service from "../../shared/service";
import { aggregateData, createHistogram } from "../../shared/utils";

import { BarChart, LineChart, PieChart } from "echarts/charts";

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
import { redirect } from "next/navigation";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  PieChart,
  LineChart,
  CanvasRenderer,
  LegendComponent,
]);

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  useEffect(() => {
    params.then((res) => {
      setJob(res.slug);
    });
  });

  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState("");
  const [jobData, setJobData] = useState(null);
  const [jobIridiumIra, setJobIridiumIra] = useState(null);
  const [frameTypePieChartData, setFrameTypePieChartData] = useState({});
  const [frameTypeBarChartData, setFrameTypeBarChartData] = useState({});
  const [snrDistrubtionData, setSnrDistributionData] = useState({});
  const [packetsOverTimeData, setPacketsOverTimeData] = useState({});
  const [snrOverTimeData, setSnrOverTimeData] = useState({});

  const onJobSelected = (jobName: string) => {
    redirect(`/jobs/${jobName}`);
  };

  useEffect(() => {
    Service.getDatasets().then((response) => {
      setJobs(response);
    });
  }, []);

  useEffect(() => {
    setJobIridiumIra(null);
    setFrameTypePieChartData(null);
    setFrameTypeBarChartData(null);
    setSnrDistributionData(null);
    setPacketsOverTimeData(null);
    setJobData(null);
    setSnrOverTimeData(null);
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
        ).sort((a, b) => {
          if (a.value < b.value) {
            return 1;
          } else if (a.value > b.value) {
            return -1;
          }
          return 0;
        });
        updateFrameTypePieChart(data);
        updateFrameTypeBarChart(data);
        updatePacketsOverTimeData(response);
        updateSnrOverTimeChart(response);

        const snrDistribution = createHistogram(
          response.map((data) => data.snr),
          20
        );
        updateSnrDistributionChart(snrDistribution);
      });
    }
  }, [job]);

  const updateFrameTypePieChart = (data) => {
    setFrameTypePieChartData({
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
        },
      ],
    });
  };

  const updateFrameTypeBarChart = (data) => {
    setFrameTypeBarChartData({
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item["name"]),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item["value"]),
          type: "bar",
        },
      ],
    });
  };

  const updateSnrDistributionChart = (data) => {
    setSnrDistributionData({
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "category",
        data: data.buckets.map((item) => `${item[0]} - ${item[1]}`),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.counts,
          type: "bar",
        },
      ],
    });
  };

  const updateSnrOverTimeChart = (data) => {
    const aggregatedData = aggregateData(data, 60);

    setSnrOverTimeData({
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "time",
      },
      yAxis: {
        type: "value",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "min",
          data: aggregatedData.map((element) => [
            element.time,
            element.snr_min,
          ]),
          type: "line",
        },
        {
          name: "avg",
          data: aggregatedData.map((element) => [
            element.time,
            element.snr_avg,
          ]),
          type: "line",
        },
        {
          name: "max",
          data: aggregatedData.map((element) => [
            element.time,
            element.snr_max,
          ]),
          type: "line",
        },
      ],
    });
  };

  const updatePacketsOverTimeData = (data) => {
    // Convert to Date objects and round to the nearest minute
    data.forEach((item) => {
      item.minute = new Date(Math.floor(item.time * 1000));
      item.minute.setSeconds(0, 0);
    });

    // Aggregate items by minute
    const aggregated = data.reduce((acc, curr, index) => {
      const minuteKey = curr.minute.getTime();

      if (!acc[minuteKey]) {
        acc[minuteKey] = { time: minuteKey / 1000, value: 0 };
      }
      acc[minuteKey].value += index + 1;

      return acc;
    }, {});

    // Convert the aggregated object back to an array
    const packetsOverTime = Object.values(aggregated);

    // Accumulate data
    let accumulated = [];
    let total = 0;

    packetsOverTime.forEach((item) => {
      total += item.value;
      accumulated.push({
        time: item.time,
        value: total,
      });
    });

    setPacketsOverTimeData({
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "time",
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: accumulated.map((item) => [new Date(item.time), item.value]),
          type: "line",
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
                      {job && (
                        <>
                          <label htmlFor="job">Job</label>
                          <select
                            className="form-select"
                            onChange={(event) =>
                              onJobSelected(event.target.value)
                            }
                            defaultValue={job}
                            id="jobName"
                          >
                            {jobs.map((value, index) => (
                              <option value={value} key={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {job && (
            <>
              <div className="row row-cards mt-3">
                <div className="col">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Example data</h3>
                    </div>
                    <div className="card-body">
                      {jobData ? (
                        <div className="table-responsive">
                          <table className="table table-condensed table-vcenter">
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
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row row-cards mt-3">
                <div className="col">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Frame types</h3>
                    </div>
                    <div className="card-body">
                      {frameTypePieChartData ? (
                        <ReactEChartsCore
                          echarts={echarts}
                          option={frameTypePieChartData}
                        />
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card">
                    <div className="card-header">Frame types</div>
                    <div className="card-body">
                      {frameTypeBarChartData ? (
                        <ReactEChartsCore
                          echarts={echarts}
                          option={frameTypeBarChartData}
                        />
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">SNR distribution</h3>
                    </div>
                    <div className="card-body">
                      {snrDistrubtionData ? (
                        <ReactEChartsCore
                          echarts={echarts}
                          option={snrDistrubtionData}
                        />
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Packets over time</h3>
                    </div>
                    <div className="card-body">
                      {packetsOverTimeData ? (
                        <ReactEChartsCore
                          echarts={echarts}
                          option={packetsOverTimeData}
                        />
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">SNR over time</h3>
                    </div>
                    <div className="card-body">
                      {snrOverTimeData ? (
                        <ReactEChartsCore
                          echarts={echarts}
                          option={snrOverTimeData}
                        />
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
