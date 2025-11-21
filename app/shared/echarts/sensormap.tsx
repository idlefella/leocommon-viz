"use client";
import ReactEChartsCore from "echarts-for-react/lib/core";
import {
  BarChart,
  CustomChart,
  MapChart,
  PieChart,
  ScatterChart,
} from "echarts/charts";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";
import globe from "../../../public/geo-data/world.geo.json";
import { Client, FeatureCollection } from "../../shared/service";

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
  MapChart,
  CustomChart,
]);

echarts.registerMap("world", JSON.stringify(globe));

interface IEchartsGeoMapSensors {
  // A list of clients
  clients: Client[];
  // A list of geojson
  coverageMaps: FeatureCollection | null;
}

export default function EchartsGeoMapSensors(params: IEchartsGeoMapSensors) {
  let echartRef: EChartsReactCore | null = null;
  const [chartData, setChartData] = useState<EChartsOption | null>(null);

  useEffect(() => {
    setChartData(sensormap_option(1));
  }, [params.clients, params.coverageMaps]);

  const onEvents = {
    georoam: (params: any) => {
      if (params.totalZoom) {
        let zooming = sensormap_option(params.totalZoom);
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

  function sensormap_option(zoom: number): EChartsOption {
    // Current time in seconds
    const now = new Date().getTime() / 1000.0;

    // Show as active when last timestamp newer than x seconds
    const active_cutoff_seconds = 180 * 24 * 60 * 60;

    const sensorLocationSeries = [
      {
        // Locations of the receivers
        type: "scatter",
        coordinateSystem: "geo",
        geoIndex: 0,
        symbolSize: 10,
        progressive: false,
        encode: {
          // `2` is the dimension index of series.data
          tooltip: 2,
          label: 2,
        },
        data: params.clients
          .filter(
            (item) => now - item.status_status_time <= active_cutoff_seconds
          )
          .map((item) => [
            item.status_location_lon,
            item.status_location_lat,
            `${item.sensor_name} (online)`,
            10,
          ]),
        //symbol: "pin",
        itemStyle: {
          color: "#ff00009f",
          borderWidth: 1,
          borderColor: "#7e00009d",
          //shadowBlur: 10,
          //shadowColor: "rgba(230, 43, 43, 0.8)",
        },
        emphasis: {
          disabled: false,
        },
      },
      {
        // Locations of the receivers
        type: "scatter",
        coordinateSystem: "geo",
        geoIndex: 0,
        symbolSize: 5,
        //symbol: 'pin',
        progressive: false,
        encode: {
          // `2` is the dimension index of series.data
          tooltip: 2,
          label: 2,
        },
        data: params.clients
          .filter(
            (item) => now - item.status_status_time > active_cutoff_seconds
          )
          .map((item) => [
            item.status_location_lon,
            item.status_location_lat,
            `${item.sensor_name} (offline)`,
            10,
          ]),
        itemStyle: {
          color: "#96969694",
          borderWidth: 1,
          borderColor: "#00000080",
        },
        emphasis: {
          disabled: true,
        },
      },
    ];

    const coverageSeries = params.coverageMaps
      ? params.coverageMaps.features.map((value, index) => {
          return {
            name: `Sensor Coverage ${value.properties.sensor_name}`,
            type: "custom",
            coordinateSystem: "geo",
            renderItem: function (params, api) {
              const coords = value.geometry.coordinates[0].map((coord) =>
                api.coord([coord[0], coord[1]])
              );
              return {
                type: "polygon",
                shape: {
                  points: coords,
                },
                style: {
                  fill: "#ff646433",
                  stroke: "#ff646433",
                  lineWidth: 2,
                },
                tooltip: {
                  show: true,
                },
              };
            },
            data: [value[index]],
            tooltip: {
              show: true,
            },
            itemStyle: {
              color: "#ff6464",
            },
          };
        })
      : [];

    return {
      animation: false,

      legend: {
        orient: "horizontal",
        left: "top",
      },

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
      series: [...sensorLocationSeries, ...coverageSeries],
      tooltip: {},
    };
  }

  return (
    chartData && (
      <ReactEChartsCore
        echarts={echarts}
        option={chartData}
        notMerge={false}
        style={{ height: "500px" }}
        ref={(e) => {
          echartRef = e;
        }}
        onEvents={onEvents}
      />
    )
  );
}
