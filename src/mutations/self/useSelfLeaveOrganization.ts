import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, User } from "@src/interfaces";
import {
  SELF_ORGANIZATIONS_QUERY_KEY,
  SET_SELF_QUERY_DATA,
} from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * @category Params
 * @group Self
 */
export interface SelfLeaveOrganizationParams extends MutationParams {
  organizationId: string;
}

/**
 * @category Methods
 * @group Self
 */
export const SelfLeaveOrganization = async ({
  organizationId,
  adminApiParams,
  queryClient,
}: SelfLeaveOrganizationParams): Promise<ConnectedXMResponse<User>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<User>>(
    `/self/organizations/${organizationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_ORGANIZATIONS_QUERY_KEY() });
    SET_SELF_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Self
 */
export const useSelfLeaveOrganization = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SelfLeaveOrganization>>,
      Omit<SelfLeaveOrganizationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfLeaveOrganizationParams,
    Awaited<ReturnType<typeof SelfLeaveOrganization>>
  >(SelfLeaveOrganization, options);
};
