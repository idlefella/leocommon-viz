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

const assignColor = (satelliteId: string) => {
  if (!satelliteId) {
    return [1.0, 1.0, 1.0];
  } else if (satelliteId.includes("IRIDIUM")) {
    return [0.878, 0.051, 0.133]; // red #e00d22
  } else if (satelliteId.includes("STARLINK")) {
    return [0.051, 0.431, 0.992]; // blue #0d6efd
  } else if (satelliteId.includes("ORBCOMM")) {
    return [0.051, 0.792, 0.941] // cyan #0dcaf0
  } else if (satelliteId.includes("ONEWEB")) {
    return [0.992, 0.494, 0.078] // orange #fd7e14
  } else if (satelliteId.includes("GLOBALSTAR")) {
    return [0.098, 0.529, 0.329] // green #198754
  } else {
    return [0.4, 0.4, 0.4]; // grey #666666
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
            color: assignColor(item.name),
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
