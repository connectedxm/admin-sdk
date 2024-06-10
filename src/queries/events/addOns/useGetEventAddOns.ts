import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_ADD_ONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ADD_ONS",
];

export const SET_EVENT_ADD_ONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOns>>
) => {
  client.setQueryData(EVENT_ADD_ONS_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventAddOns = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/addOns`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventAddOns = (eventId: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventAddOns>>(
    EVENT_ADD_ONS_QUERY_KEY(eventId),
    (params: any) => GetEventAddOns(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventAddOns;
