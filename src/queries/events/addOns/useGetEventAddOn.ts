import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ADD_ONS_QUERY_KEY } from "./useGetEventAddOns";

export const EVENT_ADD_ON_QUERY_KEY = (eventId: string, addOnId: string) => [
  ...EVENT_ADD_ONS_QUERY_KEY(eventId),
  addOnId,
];

export const SET_EVENT_ADD_ON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ADD_ON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOn>>
) => {
  client.setQueryData(EVENT_ADD_ON_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnProps {
  eventId: string;
  addOnId: string;
}

export const GetEventAddOn = async ({
  eventId,
  addOnId,
}: GetEventAddOnProps): Promise<ConnectedXMResponse<EventAddOn>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/addOns/${addOnId}`);
  return data;
};

const useGetEventAddOn = (eventId: string, addOnId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAddOn>>(
    EVENT_ADD_ON_QUERY_KEY(eventId, addOnId),
    () => GetEventAddOn({ eventId, addOnId: addOnId || "unknown" }),
    {
      enabled: !!eventId && !!addOnId,
    }
  );
};

export default useGetEventAddOn;
