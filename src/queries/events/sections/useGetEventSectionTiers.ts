import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SECTION_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  sectionId: string
) => [
  ...EVENT_SECTION_QUERY_KEY(eventId, sectionId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SECTION_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTiers>>
) => {
  client.setQueryData(EVENT_SECTION_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSectionTiers = async ({
  allowed,
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/tiers`,
    {
      params: {
        allowed,
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSectionTiers = (
  allowed: boolean,
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSectionTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionTiers>>
  >(
    EVENT_SECTION_TIERS_QUERY_KEY(allowed, eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSectionTiers({
        ...params,
        allowed,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!sectionId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
