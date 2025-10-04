import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { TaxIntegration } from "@src/interfaces";
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
export const TAX_INTEGRATIONS_QUERY_KEY = () => ["TAX_INTEGRATIONS"];

/**
 * @category Setters
 * @group Integrations
 */
export const SET_TAX_INTEGRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TAX_INTEGRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTaxIntegrations>>
) => {
  client.setQueryData(TAX_INTEGRATIONS_QUERY_KEY(...keyParams), response);
};

interface GetTaxIntegrationsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Integrations
 */
export const GetTaxIntegrations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTaxIntegrationsProps): Promise<ConnectedXMResponse<TaxIntegration[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/tax`, {
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
export const useGetTaxIntegrations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetTaxIntegrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetTaxIntegrations>>
  >(
    TAX_INTEGRATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetTaxIntegrations(params),
    params,
    options
  );
};
