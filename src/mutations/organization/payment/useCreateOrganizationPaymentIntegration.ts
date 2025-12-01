import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PaymentIntegration } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { OrganizationPaymentIntegrationCreateInputs } from "@src/params";
import {
  SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA,
  ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Organization-Payments
 */
export interface CreateOrganizationPaymentIntegrationParams
  extends MutationParams {
  integration: OrganizationPaymentIntegrationCreateInputs;
}

/**
 * @category Methods
 * @group Organization-Payments
 */
export const CreateOrganizationPaymentIntegration = async ({
  integration,
  adminApiParams,
  queryClient,
}: CreateOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<PaymentIntegration>
  >(`/organization/payment`, integration);
  if (queryClient && data.status === "ok" && data.data?.id) {
    SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA(
      queryClient,
      [data.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
    });
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
  >(CreateOrganizationPaymentIntegration, options);
};
