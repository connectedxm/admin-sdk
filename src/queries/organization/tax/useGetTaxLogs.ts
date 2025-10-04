import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "../../useConnectedInfiniteQuery";
import { TAX_INTEGRATION_QUERY_KEY } from "./useGetTaxIntegration";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, TaxIntegrationLog } from "@src/interfaces";

/**
 * @category Keys
 * @group Tax Integrations
 */
export const TAX_LOGS_QUERY_KEY = (type: string): QueryKey => [
  ...TAX_INTEGRATION_QUERY_KEY(type),
  "LOGS",
];

/**
 * @category Setters
 * @group Tax Integrations
 */
export const SET_TAX_LOGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TAX_LOGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTaxLogs>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = [""]
) => {
  client.setQueryData(
    [
      ...TAX_LOGS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetTaxLogsProps extends InfiniteQueryParams {
  type: string;
}

/**
 * @category Queries
 * @group Tax Integrations
 */
export const GetTaxLogs = async ({
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetTaxLogsProps): Promise<ConnectedXMResponse<TaxIntegrationLog[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<TaxIntegrationLog[]>>(
    `/organization/tax/${type}/logs`,
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

/**
 * @category Hooks
 * @group Tax Integrations
 */
export const useGetTaxLogs = (
  type: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetTaxLogs>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetTaxLogs>>>(
    TAX_LOGS_QUERY_KEY(type),
    (params: Omit<GetTaxLogsProps, "type">) => GetTaxLogs({ ...params, type }),
    params,
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    }
  );
};
