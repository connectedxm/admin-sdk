import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventActivation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_ACTIVATIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ACTIVATIONS",
];

export const SET_EVENT_ACTIVATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivations>>
) => {
  client.setQueryData(EVENT_ACTIVATIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventActivationsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventActivations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventActivationsProps): Promise<
  ConnectedXMResponse<EventActivation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/activations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventActivations = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivations>>
  >(
    EVENT_ACTIVATIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventActivations(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventActivations;
