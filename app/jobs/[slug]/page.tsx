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
import Header from "@/app/shared/tabler/header";
import { Card2 } from "@/app/shared/tabler/card";

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

  useEffect(() => {
    Service.getDatasets().then((response) => {
      setJobs(response);
    });
  }, []);

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
      <Header title="Jobs" pretitle="LeoCommon Explorer">
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
      </Header>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            <div className="col">
              <Card2 title="Select Job">
                <form action="#">
                  {job && (
                    <>
                      <label htmlFor="job">Job</label>
                      <select
                        className="form-select"
                        onChange={(event) => onJobSelected(event.target.value)}
                        value={job}
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
                </form>
              </Card2>
            </div>
          </div>
          {job && (
            <>
              <div className="row row-cards mt-3">
                <div className="col">
                  <Card2 title="Example data">
                    {jobData ? (
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
                    ) : (
                      <div className="loader"></div>
                    )}
                  </Card2>
                </div>
              </div>

              <div className="row row-cards mt-3">
                <div className="col">
                  <Card2 title="Frame types">
                    {frameTypePieChartData ? (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={frameTypePieChartData}
                      />
                    ) : (
                      <div className="loader"></div>
                    )}
                  </Card2>
                </div>
                <div className="col">
                  <Card2 title="Frame types">
                    {frameTypeBarChartData ? (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={frameTypeBarChartData}
                      />
                    ) : (
                      <div className="loader"></div>
                    )}
                  </Card2>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <Card2 title="SNR distribution">
                    {snrDistrubtionData ? (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={snrDistrubtionData}
                      />
                    ) : (
                      <div className="loader"></div>
                    )}
                  </Card2>
                </div>
                <div className="col-6">
                  <Card2 title="Packets over time">
                    {packetsOverTimeData ? (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={packetsOverTimeData}
                      />
                    ) : (
                      <div className="loader"></div>
                    )}
                  </Card2>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <Card2 title="SNR over time">
                    {snrOverTimeData ? (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={snrOverTimeData}
                      />
                    ) : (
                      <div className="loader"></div>
                    )}
                  </Card2>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
