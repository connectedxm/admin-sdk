import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, TaxIntegration } from "@src/interfaces";
import {
  TAX_INTEGRATIONS_QUERY_KEY,
  SET_TAX_INTEGRATION_QUERY_DATA,
} from "@src/queries";
import { TaxIntegrationCreateInputs } from "@src/params";
import { TaxIntegrationType } from "@src/interfaces";

/**
 * @category Params
 * @group Integration
 */
export interface CreateTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
  integration: TaxIntegrationCreateInputs;
}

/**
 * @category Methods
 * @group Integration
 */
export const CreateTaxIntegration = async ({
  type,
  integration,
  adminApiParams,
  queryClient,
}: CreateTaxIntegrationParams): Promise<
  ConnectedXMResponse<TaxIntegration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<TaxIntegration>>(
    `/organization/tax/${type}`,
    integration
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TAX_INTEGRATIONS_QUERY_KEY() });
    SET_TAX_INTEGRATION_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
export const useCreateTaxIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateTaxIntegration>>,
      Omit<CreateTaxIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateTaxIntegrationParams,
    Awaited<ReturnType<typeof CreateTaxIntegration>>
  >(CreateTaxIntegration, options, {
    domain: "org",
    type: "create",
  });
};
