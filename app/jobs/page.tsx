"use client";

import { IconPlus } from "@tabler/icons-react";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";
import { Service } from "../shared/service";

import { BarChart, LineChart, PieChart } from "echarts/charts";

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
import { redirect } from "next/navigation";
import { Card2 } from "../shared/tabler/card";

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

export default function Job() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    Service.getDatasets().then((response) => {
      setJobs(response);
    });
  }, []);

  const onSelectChange = (job: string) => {
    redirect(`/jobs/${job}`);
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
                  <IconPlus />
                  Create new measurement
                </a>
                <a
                  href="#"
                  className="btn btn-primary btn-6 d-sm-none btn-icon"
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
              <Card2 title="Select Job">
                <form action="#">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="job">Job</label>
                      <select
                        className="form-select"
                        onChange={(event) => onSelectChange(event.target.value)}
                      >
                        <option>-</option>
                        {jobs.map((value, index) => (
                          <option value={value} key={index}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
              </Card2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
