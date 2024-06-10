import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationSection } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SECTIONS",
];

export const SET_EVENT_SECTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSections>>
) => {
  client.setQueryData(EVENT_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sections`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSections = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSections>>
  >(
    EVENT_SECTIONS_QUERY_KEY(eventId),
    (params: any) => GetEventSections(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSections;
