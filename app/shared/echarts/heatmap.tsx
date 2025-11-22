import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { useState } from "react";

import { HeatmapChart } from "echarts/charts";

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
    HeatmapChart,
    CanvasRenderer,
    LegendComponent,
]);

interface HeatmapChartDataPoint {
    month: number;
    year: number;
    value: number;
}
export interface IHeatmapChartData {
    data: HeatmapChartDataPoint[];
}

export function EchartHeatmapChart(params: IHeatmapChartData) {
    const option = {
        tooltip: {
            position: "top",
        },
        xAxis: {
            type: "category",
            splitArea: {
                show: true
            },
        },
        yAxis: {
            type: "category",
            splitArea: {
                show: true
            },
        },
        visualMap: {
            inRange: {
                color: ['#b0f2bc', '#257d98']
            },
            min: 0,
            max: 100,
            calculable: true,
            orient: 'vertical',
            bottom: '70%'
        },
        series: {
            name: 'Previous Number of Jobs',
            type: 'heatmap',
            data: params.data,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            }
        }
    };

    return params.data ? (
        <ReactEChartsCore echarts={echarts} option={option} />
    ) : (
        <div className="loader"></div>
    );
}
