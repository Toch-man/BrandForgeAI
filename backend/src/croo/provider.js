import {
  AgentClient,
  EventType,
  DeliverableType,
} from "../../node-sdk/dist/index.js";
import { handleTask } from "./handler.js";
import { config } from "../config.js";

const client = new AgentClient(
  {
    baseURL: config.crooApiUrl,
    wsURL: config.crooWsUrl,
    rpcURL: config.baseRpcUrl,
  },
  config.crooSdkKey,
);

const stream = await client.connectWebSocket();

console.log("✅ Connected to CROO");

stream.on(EventType.NegotiationCreated, async (event) => {
  console.log("Negotiation:", event.negotiation_id);

  await client.acceptNegotiation(event.negotiation_id);
});

stream.on(EventType.OrderPaid, async (event) => {
  console.log("Order Paid:", event.order_id);

  const result = await handleTask(event);

  await client.deliverOrder(event.order_id, {
    deliverableType: DeliverableType.Text,
    deliverableText: JSON.stringify(result),
  });

  console.log("Delivered.");
});

stream.on(EventType.OrderCompleted, (event) => {
  console.log("Completed:", event.order_id);
});
