"use client";
import React, { useRef, useState } from "react";
import { IconPlus, IconSatellite } from "@tabler/icons-react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts/core";
import Card from "../shared/tabler/card";
import globe from "../../public/geo-data/world.geo.json"
import { BarChart, PieChart, ScatterChart } from "echarts/charts";

import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    GeoComponent
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
import EChartsReactCore from "echarts-for-react/lib/core";

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    PieChart,
    ScatterChart,
    CanvasRenderer,
    GeoComponent
]);

echarts.registerMap("world", JSON.stringify(globe))

export default function Test() {
    let echartRef: EChartsReactCore | null = null
    const chartRef = useRef(null);

    const [chartconfig, setChartConfig] = useState(sensormap_option(1))

    const [zoom, setZoom] = useState(1);

    const onEvents = {
        georoam: (params) => {
            params.totalZoom
            let zooming = sensormap_option(params.totalZoom)
            echartRef?.getEchartsInstance().setOption({
                series: zooming.series
            })
        },
    };

    function sensormap_option(zoom: number) {
        return {
            toolbox: {
                feature: {
                    dataZoom: {},
                    restore: {}
                }
            },

            animation: false,

            geo: {
                id: 'world-geo',
                map: 'world',
                roam: true,
                // nameProperty: 'name_en', // If using en name.
                label: {
                    show: false,
                    textBorderColor: '#fff',
                    textBorderWidth: 2
                },
            },

            series: [
                {
                    // Locations of the receivers
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbolSize: 1 * zoom,
                    encode: {
                        // `2` is the dimension index of series.data
                        tooltip: 2,
                        label: 2
                    },
                    data: [
                        // Longitude, latitude, status as string
                        // Dummy point, input real data and check if active or not
                        [6.914567708276425, 46.83996545054292, "active", 10]
                    ],
                    itemStyle: {
                        color: '#00ff00',
                        borderWidth: 1,
                        borderColor: '#000000'
                    },
                    emphasis: {
                        disabled: true,
                    }
                },
                {
                    // Worst case coverage of receivers based on their RadioHorizon
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbolSize: 45 * zoom,
                    encode: {
                        // `2` is the dimension index of series.data
                        tooltip: 2,
                        label: 2
                    },
                    data: [
                        // Longitude, latitude, status as string
                        // Dummy point, input real data and check if active or not
                        [6.914567708276425, 46.83996545054292, "worst case coverage", 100]
                    ],
                    itemStyle: {
                        color: 'rgb(0,0,0,0)',
                        borderWidth: 1,
                        borderColor: '#ff0000'
                    },
                    emphasis: {
                        disabled: true,
                    }
                },
                {
                    // Best case coverage of receivers based on their RadioHorizon
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbolSize: 90 * zoom,
                    encode: {
                        // `2` is the dimension index of series.data
                        tooltip: 2,
                        label: 2,
                    },
                    data: [
                        // Longitude, latitude, status as string
                        // Dummy point, input real data and check if active or not
                        [6.914567708276425, 46.83996545054292, "best case coverage", 30]
                    ],
                    itemStyle: {
                        color: 'rgb(0,0,0,0)',
                        borderWidth: 1,
                        borderColor: '#800080'
                    },
                    emphasis: {
                        disabled: true,
                    }
                },
            ],
            tooltip: {},
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-header d-print-none" aria-label="Page header">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">LeoCommon Explorer</div>
                            <h2 className="page-title">Test-Page</h2>
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
                    <div className="flex-row">
                        <div className="col">
                            <div className="card">
                                <div className="card-body">
                                    <div className="subheader">Sensor Overview</div>
                                    <ReactEChartsCore
                                        echarts={echarts}
                                        option={chartconfig}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"}
                                        style={{ height: '500px' }}
                                        ref={(e) => { echartRef = e; }}
                                        onEvents={onEvents}
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
