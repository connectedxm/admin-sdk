import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  OrganizationTrigger,
  OrganizationTriggerType,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_ORGANIZATION_TRIGGER_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Organization-Triggers
 */
export interface UpdateOrganizationTriggerParams extends MutationParams {
  type: OrganizationTriggerType;
  code: string;
}

/**
 * @category Methods
 * @group Organization-Triggers
 */
export const UpdateOrganizationTrigger = async ({
  type,
  code,
  adminApiParams,
  queryClient,
}: UpdateOrganizationTriggerParams): Promise<
  ConnectedXMResponse<OrganizationTrigger>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<OrganizationTrigger>
  >(`/organization/triggers/${type}`, {
    code,
  });
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_TRIGGER_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Triggers
 */
export const useUpdateOrganizationTrigger = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationTrigger>>,
      Omit<UpdateOrganizationTriggerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationTriggerParams,
    Awaited<ReturnType<typeof UpdateOrganizationTrigger>>
  >(UpdateOrganizationTrigger, options);
};
