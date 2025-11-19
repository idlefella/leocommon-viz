import { twoline2satrec } from "satellite.js";
import data from "../globe/data";

const BASE_URL = "http://192.168.254.142:8000";

// TODO
class TLEResponse {}

const assignCategory = (satelliteId: string) => {
  if (!satelliteId) {
    return "Scientific";
  } else if (satelliteId.includes("STARLINK")) {
    return "Debris";
  } else if (satelliteId.includes("IRIDIUM")) {
    return "Navigation";
  } else if (satelliteId.includes("ORBCOMM")) {
    return "Communications";
  } else {
    return "Scientific";
  }
};

export default {
  getTLEs: (system: string) => {
    const params = new URLSearchParams();
    if (system != "all") {
      params.append("system", system);
    }
    return fetch(`${BASE_URL}/tle?${params}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.map((item) => {
          return {
            name: item.name,
            satelliteId: item.satelliteId,
            color: [0.7, 0.7, 1],
            category: assignCategory(item.name),
            satrec: twoline2satrec(item.line1, item.line2),
          };
        });
      });
  },
  getDatasets: () => {
    return fetch(`${BASE_URL}/datasets`).then((response) => {
      return response.json();
    });
  },
  getDf: (dataset: string) => {
    return fetch(`${BASE_URL}/df?dataset=${dataset}`).then((response) => {
      return response.json();
    });
  },
  getDfInfo: (dataset: string) => {
    return fetch(`${BASE_URL}/df/info?dataset=${dataset}`).then((response) => {
      return response.json();
    });
  },
  getIridiumIra: (dataset: string) => {
    return fetch(`${BASE_URL}/iridium_ira`).then((response) => {
      return response.json();
    });
  },
};
