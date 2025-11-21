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
    return [0.051, 0.792, 0.941]; // cyan #0dcaf0
  } else if (satelliteId.includes("ONEWEB")) {
    return [0.992, 0.494, 0.078]; // orange #fd7e14
  } else if (satelliteId.includes("GLOBALSTAR")) {
    return [0.098, 0.529, 0.329]; // green #198754
  } else {
    return [0.4, 0.4, 0.4]; // grey #666666
  }
};

export interface Client {
  sensor_name: string;
  jobs: any[];
  status_status_time: number;
  status_location_lat: number;
  status_location_lon: number;
  status_os_version: string;
  status_temperature_celsius: number;
  status_LTE: string;
  status_WiFi: string;
  status_Ethernet: string;
}

export interface PacketWithTime {
  year: number;
  month: number;
  count: number;
  year_month: string;
}

export interface JobCountWithTime {
  year: number;
  month: number;
  unique_job_count: number;
}

export interface FrameStat {
  frame_type: string
  count: number
}

export interface FeatureCollection {
  type: string
  features: any[]
}

export const Service = {
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
  getClients: () => {
    return fetch(`${BASE_URL}/clients`).then((response) => {
      return response.json() as Promise<Client[]>;
    });
  },
  getNetworkPacketsOverTime: () => {
    return fetch(`${BASE_URL}/network_stats_packets_over_time`).then(
      (response) => {
        return response.json() as Promise<PacketWithTime[]>;
      }
    );
  },
  getNumberOfJobsOverTime: () => {
    return fetch(`${BASE_URL}/network_stats_number_of_jobs_per_month`).then(
      (response) => {
        return response.json() as Promise<JobCountWithTime[]>;
      }
    );
  },
  getNumberOfPackets: () => {
    return fetch(`${BASE_URL}/network_stats_number_of_packets`).then(
      (response) => {
        return response.json() as Promise<FrameStat[]>;
      }
    );
  },
  getCoverageOfClient: () => {
    return fetch(`${BASE_URL}/clients_geojson`).then(
      (response) => {
        return response.json() as Promise<FeatureCollection>;
      }
    );
  }
};
