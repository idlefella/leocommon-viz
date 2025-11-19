"use client";
import { IconPlus, IconSatellite } from "@tabler/icons-react";
import ReactEChartsCore from "echarts-for-react/lib/core";
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
const sensormap_option = {
    geo: {
        map: 'world',
        roam: true,
        // nameProperty: 'name_en', // If using en name.
        label: {
            show: false,
            textBorderColor: '#fff',
            textBorderWidth: 2
        }
    },
    series: [
        {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            encode: {
                // `2` is the dimension index of series.data
                tooltip: 2,
                label: 2
            },
            data: [
                // Longitude, latitude, status as string
                // Dummy point, input real data and check if active or not
                [6.914567708276425, 46.83996545054292, "active"]
            ],
            itemStyle: {
                color: '#00ff00',
                borderWidth: 1,
                borderColor: '#00ff00'
            }
        },
    ],
    tooltip: {},
};
export default function Test() {
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
                                        option={sensormap_option}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"}
                                        style={{ height: '500px' }}
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
