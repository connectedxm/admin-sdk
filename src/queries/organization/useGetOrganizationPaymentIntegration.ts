import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { PaymentIntegration } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY } from "./useGetOrganizationPaymentIntegrations";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY = (type: string) => [
  ...ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
  type,
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPaymentIntegration>>
) => {
  client.setQueryData(
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPaymentIntegrationProps extends SingleQueryParams {
  integrationId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationPaymentIntegration = async ({
  integrationId,
  adminApiParams,
}: GetOrganizationPaymentIntegrationProps): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/${integrationId}`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationPaymentIntegration = (
  integrationId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  >(
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(integrationId),
    (params: SingleQueryParams) =>
      GetOrganizationPaymentIntegration({ integrationId, ...params }),
    {
      ...options,
      enabled: !!integrationId && (options?.enabled ?? true),
      retry: false,
    }
  );
};
