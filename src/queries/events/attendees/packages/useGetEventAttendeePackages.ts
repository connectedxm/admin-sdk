import {
  AttendeePackage,
  ConnectedXMResponse,
  PurchaseStatus,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_PACKAGES_QUERY_KEY = (
  eventId: string,
  accountId: string,
  status?: keyof typeof PurchaseStatus
) => {
  const key = [...EVENT_ATTENDEE_QUERY_KEY(eventId, accountId), "PACKAGES"];

  if (status) {
    key.push(status);
  }

  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_PACKAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PACKAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePackages>>
) => {
  client.setQueryData(
    EVENT_ATTENDEE_PACKAGES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAttendeePackagesProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
  status?: keyof typeof PurchaseStatus;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeePackages = async ({
  eventId,
  accountId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeePackagesProps): Promise<
  ConnectedXMResponse<AttendeePackage[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/packages`,
    {
      params: {
        status: status || undefined,
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
export const useGetEventAttendeePackages = (
  eventId: string = "",
  accountId: string = "",
  status?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeePackages>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeePackages>>
  >(
    EVENT_ATTENDEE_PACKAGES_QUERY_KEY(eventId, accountId, status),
    (params: InfiniteQueryParams) =>
      GetEventAttendeePackages({
        ...params,
        eventId,
        accountId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!accountId && (options.enabled ?? true),
    },
    "events"
  );
};
