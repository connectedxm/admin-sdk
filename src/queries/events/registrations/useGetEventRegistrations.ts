import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Registration, RegistrationStatus } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  status?: RegistrationStatus
) => {
  let keys = [...EVENT_QUERY_KEY(eventId), "REGISTRATIONS"];
  if (status) keys.push(status);
  return keys;
};

export const SET_EVENT_REGISTRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrations>>
) => {
  client.setQueryData(EVENT_REGISTRATIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventRegistrationsProps extends InfiniteQueryParams {
  eventId: string;
  status?: RegistrationStatus;
}

export const GetEventRegistrations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
}: GetEventRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/registrations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};

const useGetEventRegistrations = (
  eventId: string,
  status?: RegistrationStatus
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrations>>
  >(
    EVENT_REGISTRATIONS_QUERY_KEY(eventId, status),
    (params: any) => GetEventRegistrations(params),
    {
      eventId,
      status,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventRegistrations;
