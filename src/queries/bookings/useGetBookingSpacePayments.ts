import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment, PurchaseStatus } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_PAYMENTS_QUERY_KEY = (
  placeId: string,
  spaceId: string
) => {
  const keys = [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "PAYMENTS"];
  return keys;
};

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpacePayments>>
) => {
  client.setQueryData(BOOKING_SPACE_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpacePaymentsProps extends InfiniteQueryParams {
  placeId: string;
  spaceId: string;
  past?: boolean;
  status?: PurchaseStatus;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpacePayments = async ({
  placeId,
  spaceId,
  status,
  past,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpacePaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/payments`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        past: typeof past === "boolean" ? past : undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpacePayments = (
  placeId: string = "",
  spaceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpacePayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpacePayments>>
  >(
    BOOKING_SPACE_PAYMENTS_QUERY_KEY(placeId, spaceId),
    (params: InfiniteQueryParams) =>
      GetBookingSpacePayments({
        placeId,
        spaceId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    },
    "bookings"
  );
};
