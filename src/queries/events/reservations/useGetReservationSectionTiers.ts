import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "./useGetReservationSection";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  reservationSectionId: string
) => [
  ...EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReservationSectionTiers>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetReservationSectionTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  reservationSectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetReservationSectionTiers = async ({
  allowed,
  eventId,
  reservationSectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetReservationSectionTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tiers`,
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
export const useGetReservationSectionTiers = (
  allowed: boolean,
  eventId: string = "",
  reservationSectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetReservationSectionTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetReservationSectionTiers>>
  >(
    EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY(
      allowed,
      eventId,
      reservationSectionId
    ),
    (params: InfiniteQueryParams) =>
      GetReservationSectionTiers({
        ...params,
        allowed,
        eventId,
        reservationSectionId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!reservationSectionId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
