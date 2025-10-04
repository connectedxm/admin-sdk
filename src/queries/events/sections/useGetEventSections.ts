import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SECTIONS",
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
export const GetEventSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
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

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSections = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSections>>
  >(
    EVENT_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSections({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
