import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

export const EVENT_SESSION_SPONSORS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "SPONSORS"];

export const SET_EVENT_SESSION_SPONSORS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSponsors>>
) => {
  client.setQueryData(EVENT_SESSION_SPONSORS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionSponsorsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionSponsors = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSessionSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sponsors`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetEventSessionSponsors = (eventId: string, sessionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSponsors>>
  >(
    EVENT_SESSION_SPONSORS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) => GetEventSessionSponsors(params),
    {
      eventId,
      sessionId,
    },
    {
      enabled: !!eventId && !!sessionId,
    }
  );
};

export default useGetEventSessionSponsors;
