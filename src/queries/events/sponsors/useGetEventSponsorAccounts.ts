import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_SPONSOR_ACCOUNTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSOR_ACCOUNTS",
];

export const SET_EVENT_SPONSOR_ACCOUNTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSOR_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorAccounts>>
) => {
  client.setQueryData(EVENT_SPONSOR_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetEventSponsorAccountsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSponsorAccounts = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSponsorAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sponsors/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSponsorAccounts = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorAccounts>>
  >(
    EVENT_SPONSOR_ACCOUNTS_QUERY_KEY(eventId),
    (params: any) => GetEventSponsorAccounts(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSponsorAccounts;
