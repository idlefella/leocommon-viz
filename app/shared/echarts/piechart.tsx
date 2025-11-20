import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { useState } from "react";

import { BarChart } from "echarts/charts";

import { CanvasRenderer } from "echarts/renderers";

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);

interface PieChartDataPoint {
  name: string;
  value: number;
}

export interface IPieChartData {
  data: PieChartDataPoint[];
}

export function EchartPieChart(params: IPieChartData) {
  const option = {
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
      orient: 'horizontal',
      left: 'top'
    },
    series: [
      {
        data: params.data,
        type: "pie",
      },
    ],
  };

  return params.data ? (
    <ReactEChartsCore echarts={echarts} option={option} />
  ) : (
    <div className="loader"></div>
  );
}
