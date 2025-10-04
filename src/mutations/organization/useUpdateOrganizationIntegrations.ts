import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationIntegrationsParams extends MutationParams {
  ghost: boolean;
  ghostUrl: string;
  ghostAdminKey?: string;
  ghostContentKey?: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganizationIntegrations = async ({
  ghost,
  ghostUrl,
  ghostAdminKey,
  ghostContentKey,
  adminApiParams,
  queryClient,
}: UpdateOrganizationIntegrationsParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<null>>(
    `/organization/integrations`,
    {
      ghost,
      ghostUrl,
      ghostAdminKey,
      ghostContentKey,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateOrganizationIntegrations = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationIntegrations>>,
      Omit<
        UpdateOrganizationIntegrationsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationIntegrationsParams,
    Awaited<ReturnType<typeof UpdateOrganizationIntegrations>>
  >(UpdateOrganizationIntegrations, options);
};
