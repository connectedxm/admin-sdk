import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SessionTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "../useGetEventSession";

export const EVENT_SESSION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "TRANSLATIONS"];

export const SET_EVENT_SESSION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTranslations>>
) => {
  client.setQueryData(
    EVENT_SESSION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sessionId,
}: GetEventSessionTranslationsProps): Promise<
  ConnectedXMResponse<SessionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/translations`,
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

const useGetEventSessionTranslations = (eventId: string, sessionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionTranslations>>
  >(
    EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId),
    (params: any) => GetEventSessionTranslations(params),
    {
      eventId,
      sessionId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSessionTranslations;
