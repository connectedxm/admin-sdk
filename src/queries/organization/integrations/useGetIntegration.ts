import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { INTEGRATIONS_QUERY_KEY } from "./useGetIntegrations";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, Integration } from "@src/interfaces";

/**
 * Endpoint to retrieve details of a specific integration within an organization.
 * This function allows users to fetch comprehensive information about a particular integration using its unique identifier.
 * It is designed for applications that require detailed integration data for organizational purposes.
 * @name GetIntegration
 * @param {string} integrationId (path) The ID of the integration
 * @version 1.3
 **/

export const INTEGRATION_QUERY_KEY = (integrationId: string) => [
  ...INTEGRATIONS_QUERY_KEY(),
  integrationId,
];

export const SET_INTEGRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEGRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetIntegration>>
) => {
  client.setQueryData(INTEGRATION_QUERY_KEY(...keyParams), response);
};

interface GetIntegrationProps extends SingleQueryParams {
  integrationId: string;
}

export const GetIntegration = async ({
  integrationId,
  adminApiParams,
}: GetIntegrationProps): Promise<ConnectedXMResponse<Integration>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Integration>>(
    `/organization/integrations/${integrationId}`
  );
  return data;
};

export const useGetIntegration = (
  integrationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetIntegration>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetIntegration>>(
    INTEGRATION_QUERY_KEY(integrationId),
    (params: SingleQueryParams) =>
      GetIntegration({
        integrationId,
        ...params,
      }),
    {
      ...options,
      enabled: !!integrationId && (options.enabled ?? true),
    },
    "org"
  );
};