import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, PaymentIntegrationType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY } from "./useGetOrganizationPaymentIntegration";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_PAYMENT_INTEGRATION_LINK_QUERY_KEY = (
  type: keyof typeof PaymentIntegrationType
) => [...ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(type), "LINK"];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_STRIPE_LINK_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAYMENT_INTEGRATION_LINK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPaymentLink>>
) => {
  client.setQueryData(
    ORGANIZATION_PAYMENT_INTEGRATION_LINK_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPaymentLinkProps extends SingleQueryParams {
  type: keyof typeof PaymentIntegrationType;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationPaymentLink = async ({
  type,
  adminApiParams,
}: GetOrganizationPaymentLinkProps): Promise<ConnectedXMResponse<string>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/${type}/link`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationPaymentLink = (
  type: keyof typeof PaymentIntegrationType,
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentLink>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPaymentLink>>(
    ORGANIZATION_PAYMENT_INTEGRATION_LINK_QUERY_KEY(type),
    (params: SingleQueryParams) =>
      GetOrganizationPaymentLink({
        type,
        ...params,
      }),
    {
      ...options,
      enabled: !!type && (options?.enabled ?? true),
      retry: false,
    }
  );
};
