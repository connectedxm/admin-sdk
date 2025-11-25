import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY } from "./useGetOrganizationPaymentIntegrations";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_PAYMENT_CURRENCY_QUERY_KEY = () => [
  ...ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
  "CURRENCY",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_PAYMENT_CURRENCY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAYMENT_CURRENCY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPaymentCurrency>>
) => {
  client.setQueryData(
    ORGANIZATION_PAYMENT_CURRENCY_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPaymentCurrencyProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationPaymentCurrency = async ({
  adminApiParams,
}: GetOrganizationPaymentCurrencyProps): Promise<
  ConnectedXMResponse<{ currencyCode: string }>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/currency`);
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationPaymentCurrency = (
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentCurrency>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationPaymentCurrency>
  >(
    ORGANIZATION_PAYMENT_CURRENCY_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationPaymentCurrency(params),
    options
  );
};

