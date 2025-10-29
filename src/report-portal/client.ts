import axios from "axios";

import configs from "../configs";

export default axios.create({
  baseURL: `${configs.rp.endpoint}/${configs.rp.project}`,
  headers: {
    Authorization: `bearer ${configs.rp.apiKey}`,
  },
});
