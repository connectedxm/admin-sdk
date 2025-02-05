import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { PaymentIntegration } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * Retrieves a list of payment integrations for a specific organization.
 * This function is used to fetch and manage payment integration data within an organization,
 * allowing applications to display or process payment options available to the organization.
 * @name GetOrganizationPaymentIntegrations
 * @version 1.2
 **/

export const ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "PAYMENT_INTEGRATIONS",
];

export const SET_ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPaymentIntegrations>>
) => {
  client.setQueryData(
    ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPaymentIntegrationsProps extends InfiniteQueryParams {}

export const GetOrganizationPaymentIntegrations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetOrganizationPaymentIntegrationsProps): Promise<
  ConnectedXMResponse<PaymentIntegration[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetOrganizationPaymentIntegrations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationPaymentIntegrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationPaymentIntegrations>>
  >(
    ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetOrganizationPaymentIntegrations(params),
    params,
    options,
    "org"
  );
};