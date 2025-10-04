import { ConnectedXMResponse, PurchaseStatus } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PASSES_QUERY_KEY } from "../passes";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY = (
  eventId: string,
  passId: string,
  status?: keyof typeof PurchaseStatus
) => {
  const key = [...EVENT_PASSES_QUERY_KEY(eventId), passId, "ATTENDEE_PASSES"];

  if (status) {
    key.push(status);
  }

  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_ATTENDEE_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassAttendeePasses>>
) => {
  client.setQueryData(
    EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassAttendeePassesProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
  status?: keyof typeof PurchaseStatus;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassAttendeePasses = async ({
  eventId,
  passId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassAttendeePassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/attendee/passes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassAttendeePasses = (
  eventId: string = "",
  passId: string = "",
  status?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassAttendeePasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassAttendeePasses>>
  >(
    EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY(eventId, passId, status),
    (params: InfiniteQueryParams) =>
      GetEventPassAttendeePasses({
        ...params,
        eventId,
        passId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    }
  );
};
