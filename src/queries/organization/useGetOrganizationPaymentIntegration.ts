import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { PaymentIntegration } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY } from "./useGetOrganizationPaymentIntegrations";

export const ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY = (type: string) => [
  ...ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
  type,
];

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

interface GetOrganizationPaymentIntegrationProps {
  type: string;
}

export const GetOrganizationPaymentIntegration = async ({
  type,
}: GetOrganizationPaymentIntegrationProps): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/${type}`);
  return data;
};

const useGetOrganizationPaymentIntegration = (type: "stripe" | "paypal") => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPaymentIntegration>>((
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(type),
    () => GetOrganizationPaymentIntegration({ type }),
    {
      retry: false,
    }
  );
};

export default useGetOrganizationPaymentIntegration;
