import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Organization-Payments
 */
export interface CreateOrganizationPaymentIntegrationParams
  extends MutationParams {
  type: "stripe" | "paypal";
  clientId?: string;
  clientSecret?: string;
}

/**
 * @category Methods
 * @group Organization-Payments
 */
export const CreateOrganizationPaymentIntegration = async ({
  type,
  clientId,
  clientSecret,
  adminApiParams,
  queryClient,
}: CreateOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<any>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<any>>(
    `/organization/payment/${type}`,
    {
      clientId,
      clientSecret,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Payments
 */
export const useCreateOrganizationPaymentIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateOrganizationPaymentIntegration>>,
      Omit<
        CreateOrganizationPaymentIntegrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateOrganizationPaymentIntegrationParams,
    Awaited<ReturnType<typeof CreateOrganizationPaymentIntegration>>
  >(CreateOrganizationPaymentIntegration, options, {
    domain: "org",
    type: "update",
  });
};
