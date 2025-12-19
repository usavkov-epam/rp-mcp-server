import 'dotenv/config';

export default {
  port: process.env.PORT || 3003,
  rp: {
    endpoint: process.env.RP_API_URL!,
    project: process.env.RP_CYPRESS_PROJECT_NAME!,
    apiKey: process.env.RP_API_TOKEN!
  }
};
