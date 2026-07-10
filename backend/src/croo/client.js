import { AgentClient } from "@croo/node-sdk";

export default new AgentClient(
  {
    baseURL: process.env.CROO_API_URL,
    wsURL: process.env.CROO_WS_URL,
    rpcURL: process.env.BASE_RPC_URL,
  },
  process.env.CROO_SDK_KEY,
);
