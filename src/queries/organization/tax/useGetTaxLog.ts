import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { TAX_INTEGRATION_QUERY_KEY } from "./useGetTaxIntegration";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, TaxIntegrationLog } from "@src/interfaces";

/**
 * @category Keys
 * @group Tax Integrations
 */
export const TAX_LOG_QUERY_KEY = (type: string, logId: string): QueryKey => [
  ...TAX_INTEGRATION_QUERY_KEY(type),
  "LOG",
  logId,
];

/**
 * @category Setters
 * @group Tax Integrations
 */
export const SET_TAX_LOG_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TAX_LOG_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTaxLog>>
) => {
  client.setQueryData(TAX_LOG_QUERY_KEY(...keyParams), response);
};

interface GetTaxLogProps extends SingleQueryParams {
  type: string;
  logId: string;
}

/**
 * @category Queries
 * @group Tax Integrations
 */
export const GetTaxLog = async ({
  type,
  logId,
  adminApiParams,
}: GetTaxLogProps): Promise<ConnectedXMResponse<TaxIntegrationLog>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<TaxIntegrationLog>>(
    `/organization/tax/${type}/logs/${logId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Tax Integrations
 */
export const useGetTaxLog = (
  type: string = "",
  logId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetTaxLog>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetTaxLog>>(
    TAX_LOG_QUERY_KEY(type, logId),
    (params: SingleQueryParams) => GetTaxLog({ ...params, type, logId }),
    {
      ...options,
      enabled: !!type && !!logId && (options.enabled ?? true),
    },
    "org"
  );
};
