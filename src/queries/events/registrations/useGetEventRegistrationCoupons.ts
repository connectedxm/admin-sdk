import { ConnectedXMResponse } from "@src/interfaces";
import { Coupon } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_QUERY_KEY } from "./useGetEventRegistration";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_REGISTRATION_COUPONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  prePaid?: boolean
) => {
  const key = [
    ...EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    "COUPONS",
  ];

  if (typeof prePaid === "boolean") {
    key.push(prePaid.toString());
  }

  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_REGISTRATION_COUPONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_COUPONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationCoupons>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_COUPONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationCouponsProps extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  prePaid?: boolean;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRegistrationCoupons = async ({
  eventId,
  registrationId,
  prePaid,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRegistrationCouponsProps): Promise<
  ConnectedXMResponse<Coupon[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/coupons`,
    {
      params: {
        paid: typeof prePaid === "boolean" ? prePaid : undefined,
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
export const useGetEventRegistrationCoupons = (
  eventId: string = "",
  registrationId: string = "",
  prePaid?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationCoupons>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationCoupons>>
  >(
    EVENT_REGISTRATION_COUPONS_QUERY_KEY(eventId, registrationId, prePaid),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationCoupons({
        ...params,
        eventId,
        registrationId,
        prePaid,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!registrationId && (options.enabled ?? true),
    }
  );
};
