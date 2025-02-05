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
import { TriggerUpdateInputs } from "@src/params";
import { SET_ORGANIZATION_TRIGGER_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to update an organization trigger.
 * This function allows updating the configuration of a specific organization trigger by specifying its type and the new trigger inputs.
 * It is designed to be used in applications where organization triggers need to be modified or updated.
 * @name UpdateOrganizationTrigger
 * @param {OrganizationTriggerType} type - The type of the organization trigger
 * @param {TriggerUpdateInputs} trigger - The inputs for updating the trigger
 * @version 1.2
 **/

export interface UpdateOrganizationTriggerParams extends MutationParams {
  type: OrganizationTriggerType;
  trigger: TriggerUpdateInputs;
}

export const UpdateOrganizationTrigger = async ({
  type,
  trigger,
  adminApiParams,
  queryClient,
}: UpdateOrganizationTriggerParams): Promise<
  ConnectedXMResponse<OrganizationTrigger>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<OrganizationTrigger>>(
    `/organization/triggers/${type}`,
    {
      code: trigger.code,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_TRIGGER_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

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
  >(UpdateOrganizationTrigger, options, {
    domain: "org",
    type: "update",
  });
};