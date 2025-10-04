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
 * @category Keys
 * @group Integrations
 */
export const INTEGRATION_QUERY_KEY = (integrationId: string) => [
  ...INTEGRATIONS_QUERY_KEY(),
  integrationId,
];

/**
 * @category Setters
 * @group Integrations
 */
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

/**
 * @category Queries
 * @group Integrations
 */
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
/**
 * @category Hooks
 * @group Integrations
 */
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
    }
  );
};
