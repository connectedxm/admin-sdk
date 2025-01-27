import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, PaymentIntegrationType } from "@src/interfaces";
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
  type: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationPaymentIntegration = async ({
  type,
  adminApiParams,
}: GetOrganizationPaymentIntegrationProps): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/${type}`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationPaymentIntegration = (
  type: keyof typeof PaymentIntegrationType,
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  >(
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(type),
    (params: SingleQueryParams) =>
      GetOrganizationPaymentIntegration({ type, ...params }),
    {
      ...options,
      enabled: !!type && (options?.enabled ?? true),
      retry: false,
    },
    "org"
  );
};
