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
 * This file contains functions for retrieving and managing organization payment integration links.
 * It provides a way to fetch the URL link associated with a particular payment integration type,
 * allowing organizations to access or manage their payment integrations effectively.
 * @name OrganizationPaymentIntegration
 * @param {keyof typeof PaymentIntegrationType} type (path) The type of payment integration
 * @version 1.3
 **/

export const ORGANIZATION_PAYMENT_INTEGRATION_LINK_QUERY_KEY = (
  type: keyof typeof PaymentIntegrationType
) => [...ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(type), "LINK"];

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

export const GetOrganizationPaymentLink = async ({
  type,
  adminApiParams,
}: GetOrganizationPaymentLinkProps): Promise<ConnectedXMResponse<string>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/${type}/link`);
  return data;
};

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
    },
    "org"
  );
};