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

interface BarChartDataPoint {
    name: string;
    value: number;
}
export interface IBarChartData {
    data: BarChartDataPoint[];
}

export function EchartBarChart(params: IBarChartData) {
    const option = {
        tooltip: {
            trigger: "item"
        },
        xAxis: {
            type: "category"
        },
        yAxis: {
            type: "value"
        },
        series: {
            data: params.data,
            type: "bar",
        }    
    };

    return params.data ? (
        <ReactEChartsCore echarts={echarts} option={option} />
    ) : (
        <div className="loader"></div>
    );
}
