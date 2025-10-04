import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Integration } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Integrations
 */
export const INTEGRATIONS_QUERY_KEY = () => ["INTEGRATIONS"];

/**
 * @category Setters
 * @group Integrations
 */
export const SET_INTEGRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEGRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetIntegrations>>
) => {
  client.setQueryData(INTEGRATIONS_QUERY_KEY(...keyParams), response);
};

interface GetIntegrationsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Integrations
 */
export const GetIntegrations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetIntegrationsProps): Promise<ConnectedXMResponse<Integration[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/integrations`, {
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
 * @group Integrations
 */
export const useGetIntegrations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetIntegrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetIntegrations>>>(
    INTEGRATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetIntegrations(params),
    params,
    options
  );
};
