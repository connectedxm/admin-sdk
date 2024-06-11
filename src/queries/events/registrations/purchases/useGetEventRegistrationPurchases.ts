import { ConnectedXMResponse } from "@src/interfaces";
import { Purchase } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_QUERY_KEY } from "../useGetEventRegistration";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_REGISTRATION_PURCHASES_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  paid?: boolean
) => {
  const key = [
    ...EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    "PURCHASES",
  ];

  if (typeof paid === "boolean") {
    key.push(paid.toString());
  }

  return key;
};

export const SET_EVENT_REGISTRATION_PURCHASES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PURCHASES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchases>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchasesProps extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  paid?: boolean;
}

export const GetEventRegistrationPurchases = async ({
  eventId,
  registrationId,
  paid,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRegistrationPurchasesProps): Promise<
  ConnectedXMResponse<Purchase[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases`,
    {
      params: {
        paid: typeof paid === "boolean" ? paid : undefined,
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetEventRegistrationPurchases = (
  eventId: string = "",
  registrationId: string = "",
  paid?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationPurchases>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchases>>
  >(
    EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId, paid),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationPurchases({
        ...params,
        eventId,
        registrationId,
        paid,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!registrationId && (options.enabled ?? true),
    }
  );
};

export default useGetEventRegistrationPurchases;
