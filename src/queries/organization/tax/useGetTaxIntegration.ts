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
 * Fetches tax integration data for a specified type within an organization.
 * This function is used to retrieve detailed information about a specific tax integration type.
 * It is designed for applications that require access to tax integration details for organizational purposes.
 * @name GetTaxIntegration
 * @param {string} type (path) The type of tax integration
 * @version 1.3
 **/

export const TAX_INTEGRATION_QUERY_KEY = (type: string) => [
  ...TAX_INTEGRATIONS_QUERY_KEY(),
  type,
];

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
    },
    "org"
  );
};