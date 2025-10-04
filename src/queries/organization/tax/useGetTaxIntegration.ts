import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { TAX_INTEGRATIONS_QUERY_KEY } from "./useGetTaxIntegrations";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, TaxIntegration } from "@src/interfaces";

/**
 * @category Keys
 * @group Integrations
 */
export const TAX_INTEGRATION_QUERY_KEY = (type: string) => [
  ...TAX_INTEGRATIONS_QUERY_KEY(),
  type,
];

/**
 * @category Setters
 * @group Integrations
 */
export const SET_TAX_INTEGRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TAX_INTEGRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTaxIntegration>>
) => {
  client.setQueryData(TAX_INTEGRATION_QUERY_KEY(...keyParams), response);
};

interface GetTaxIntegrationProps extends SingleQueryParams {
  type: string;
}

/**
 * @category Queries
 * @group Integrations
 */
export const GetTaxIntegration = async ({
  type,
  adminApiParams,
}: GetTaxIntegrationProps): Promise<ConnectedXMResponse<TaxIntegration>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<TaxIntegration>>(
    `/organization/tax/${type}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Integrations
 */
export const useGetTaxIntegration = (
  type: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetTaxIntegration>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetTaxIntegration>>(
    TAX_INTEGRATION_QUERY_KEY(type),
    (params: SingleQueryParams) =>
      GetTaxIntegration({
        type,
        ...params,
      }),
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    }
  );
};
