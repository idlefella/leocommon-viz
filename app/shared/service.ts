import { useEffect, useState } from "react";
import { twoline2satrec } from "satellite.js";

const BASE_URL = "http://192.168.254.142:8000";

// TODO
class TLEResponse {}

export default {
  getTLEs: () => {
    return fetch(`${BASE_URL}/tle?system=iridium`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.map((item) => {
          return {
            name: item.name,
            satelliteId: item.satelliteId,
            category: "Communications",
            satrec: twoline2satrec(item.line1, item.line2),
          };
        });
      });
  },
  getDatasets: () => {
    return fetch(`${BASE_URL}/datasets`).then((response) => {
      response.json();
    });
  },
  getDf: () => {
    return fetch(`${BASE_URL}/df`).then((response) => {
      response.json();
    });
  },
};
