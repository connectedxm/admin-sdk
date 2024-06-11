import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Payment } from "@src/interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryOptions,
  InfiniteQueryParams,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_QUERY_KEY } from "../useGetEventRegistration";

export const EVENT_REGISTRATION_PAYMENTS_QUERY_KEY = (
  eventId: string,
  registrationId: string
) => [...EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId), "PAYMENTS"];

export const SET_EVENT_REGISTRATION_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPayments>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PAYMENTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPaymentsProps extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetEventRegistrationPayments = async ({
  eventId,
  registrationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRegistrationPaymentsProps): Promise<
  ConnectedXMResponse<Payment[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/payments`,
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
export const useGetEventRegistrationPayments = (
  eventId: string = "",
  registrationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPayments>>
  >(
    EVENT_REGISTRATION_PAYMENTS_QUERY_KEY(eventId, registrationId),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationPayments({ ...params, eventId, registrationId }),
    params,
    {
      ...options,
      enabled: !!eventId && !!registrationId && (options.enabled ?? true),
    }
  );
};
