import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { useState } from "react";

import { LineChart } from "echarts/charts";

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
  LineChart,
  CanvasRenderer,
  LegendComponent,
]);

export interface ITimelineData {
  data: [number | string, number][];
}

export function EchartTimeline(params: ITimelineData) {
  const [timelineData, setTimelineData] = useState<ITimelineData[]>([]);

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
    series: [
      {
        data: params.data,
        type: "line",
      },
    ],
  };

  return timelineData ? (
    <ReactEChartsCore echarts={echarts} option={option} />
  ) : (
    <div className="loader"></div>
  );
}
