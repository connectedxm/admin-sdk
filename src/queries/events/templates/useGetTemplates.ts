import { GetAdminAPI } from "@src/AdminAPI";
import { Event, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TEMPLATES_QUERY_KEY = () => ["EVENTS", "TEMPLATES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TEMPLATES_QUERY_DATA = (
  client: QueryClient,
  response: Awaited<ReturnType<typeof GetTemplates>>
) => {
  client.setQueryData(EVENT_TEMPLATES_QUERY_KEY(), response);
};

interface GetTemplatesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Events
 */
export const GetTemplates = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTemplatesProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/templates`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetTemplates = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetTemplates>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTemplates>>>(
    EVENT_TEMPLATES_QUERY_KEY(),
    (queryParams: InfiniteQueryParams) => GetTemplates(queryParams),
    params,
    options
  );
};
