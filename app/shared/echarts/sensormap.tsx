"use client";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { BarChart, PieChart, ScatterChart, MapChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";
import globe from "../../../public/geo-data/world.geo.json";
import { Client } from "../../shared/service";

import kaiserLauternGeoJson from "../../../public/coverage/KL_coverage.geojson.json";

// import data from "./data";

import {
  GeoComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

import { EChartsOption } from "echarts";
import EChartsReactCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  PieChart,
  ScatterChart,
  CanvasRenderer,
  GeoComponent,
  MapChart
]);

echarts.registerMap("world", JSON.stringify(globe));
// TODO
//echarts.registerMap("Kaiserlautern", JSON.stringify(kaiserLauternGeoJson));

interface IEchartsGeoMapSensors {
  clients: Client[];
}

export default function EchartsGeoMapSensors(params: IEchartsGeoMapSensors) {
  let echartRef: EChartsReactCore | null = null;
  const [chartData, setChartData] = useState<EChartsOption | null>(null);
  const chartconfig = sensormap_option(1, []);

  useEffect(() => {
    setChartData(sensormap_option(1, params.clients));
  }, [params.clients]);

  const onEvents = {
    georoam: (params: any) => {
      if (params.totalZoom) {
        let zooming = sensormap_option(params.totalZoom, []);
        echartRef?.getEchartsInstance().setOption({
          series: zooming.series!.map((item) => {
            return {
              symbolSize: item.symbolSize,
            };
          }),
        });
      }
    },
  };

  function sensormap_option(zoom: number, clients: Client[]): EChartsOption {
    // Current time in seconds
    let now = new Date().getTime() / 1000.0;

    return {
      animation: false,

      geo: {
        id: "world-geo",
        map: "world",
        roam: true,
        label: {
          show: false,
          textBorderColor: "#fff",
          textBorderWidth: 2,
        },
      },

      series: [
        {
          // Locations of the receivers
          type: "scatter",
          coordinateSystem: "geo",
          geoIndex: 0,
          symbolSize: 1 * zoom,
          progressive: false,
          encode: {
            // `2` is the dimension index of series.data
            tooltip: 2,
            label: 2,
          },
          data: clients
            .filter(
              (item) => now - item.status_status_time <= 180 * 24 * 60 * 60
            )
            .map((item) => [
              item.status_location_lon,
              item.status_location_lat,
              item.sensor_name,
              10,
            ]),
          itemStyle: {
            color: "#00ff00",
            borderWidth: 1,
            borderColor: "#000000",
          },
          emphasis: {
            disabled: true,
          },
        },
        {
          // Locations of the receivers
          type: "scatter",
          coordinateSystem: "geo",
          geoIndex: 0,
          symbolSize: 1 * zoom,
          progressive: false,
          encode: {
            // `2` is the dimension index of series.data
            tooltip: 2,
            label: 2,
          },
          data: clients
            .filter((item) => now - item.status_status_time > 24 * 60 * 60)
            .map((item) => [
              item.status_location_lon,
              item.status_location_lat,
              item.sensor_name,
              10,
            ]),
          itemStyle: {
            color: "#96969694",
            borderWidth: 1,
            borderColor: "#000000",
          },
          emphasis: {
            disabled: true,
          },
        },
        // {
        //   // Worst case coverage of receivers based on their RadioHorizon
        //   type: "scatter",
        //   coordinateSystem: "geo",
        //   geoIndex: 0,
        //   symbolSize: 45 * zoom,
        //   encode: {
        //     // `2` is the dimension index of series.data
        //     tooltip: 2,
        //     label: 2,
        //   },
        //   data: [
        //     // Longitude, latitude, status as string
        //     // Dummy point, input real data and check if active or not
        //     [6.914567708276425, 46.83996545054292, "worst case coverage", 100],
        //   ],
        //   itemStyle: {
        //     color: "rgb(0,0,0,0)",
        //     borderWidth: 1,
        //     borderColor: "#ff0000",
        //   },
        //   emphasis: {
        //     disabled: true,
        //   },
        // },
        // {
        //   // Best case coverage of receivers based on their RadioHorizon
        //   type: "scatter",
        //   coordinateSystem: "geo",
        //   geoIndex: 0,
        //   symbolSize: 90 * zoom,
        //   encode: {
        //     // `2` is the dimension index of series.data
        //     tooltip: 2,
        //     label: 2,
        //   },
        //   data: [
        //     // Longitude, latitude, status as string
        //     // Dummy point, input real data and check if active or not
        //     [6.914567708276425, 46.83996545054292, "best case coverage", 30],
        //   ],
        //   itemStyle: {
        //     color: "rgb(0,0,0,0)",
        //     borderWidth: 1,
        //     borderColor: "#800080",
        //   },
        //   emphasis: {
        //     disabled: true,
        //   },
        // },
        // {
        //   type: "map",
        //   map: "Kaiserlautern", // use the registered map
        //   // Additional layer specifics can be set here
        //   roam: true,

        // },
      ],
      tooltip: {},
    };
  }

  return (
    chartData && (
      <ReactEChartsCore
        echarts={echarts}
        option={chartData}
        notMerge={false}
        //lazyUpdate={true}
        //theme={"theme_name"}
        style={{ height: "500px" }}
        ref={(e) => {
          echartRef = e;
        }}
        onEvents={onEvents}
      />
    )
  );
}
