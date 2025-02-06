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
 * Endpoint to retrieve a list of tax integrations for an organization.
 * This function fetches tax integration data, which can be used to manage and display tax-related information within an organization.
 * It supports pagination and sorting to efficiently handle large datasets.
 * @name GetTaxIntegrations
 * @version 1.3
 **/

export const TAX_INTEGRATIONS_QUERY_KEY = () => ["TAX_INTEGRATIONS"];

export const SET_TAX_INTEGRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TAX_INTEGRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTaxIntegrations>>
) => {
  client.setQueryData(TAX_INTEGRATIONS_QUERY_KEY(...keyParams), response);
};

interface GetTaxIntegrationsProps extends InfiniteQueryParams {}

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
    options,
    "org"
  );
};