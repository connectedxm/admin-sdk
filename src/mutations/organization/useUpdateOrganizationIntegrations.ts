import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to update the organization's integrations with Ghost.
 * This function allows updating the integration settings for Ghost within an organization,
 * including enabling or disabling the integration and setting the necessary keys and URL.
 * It is designed for use in applications that manage organizational settings and integrations.
 * @name UpdateOrganizationIntegrations
 * @param {boolean} ghost (bodyValue) Indicates if Ghost integration is enabled
 * @param {string} ghostUrl (bodyValue) The URL for the Ghost instance
 * @param {string} [ghostAdminKey] (bodyValue) Optional admin key for Ghost
 * @param {string} [ghostContentKey] (bodyValue) Optional content key for Ghost
 * @version 1.3
 **/

export interface UpdateOrganizationIntegrationsParams extends MutationParams {
  ghost: boolean;
  ghostUrl: string;
  ghostAdminKey?: string;
  ghostContentKey?: string;
}

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
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<null>>(
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
  >(UpdateOrganizationIntegrations, options, {
    domain: "org",
    type: "update",
  });
};
