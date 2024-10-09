import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_USERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteOrganizationUserParams extends MutationParams {
  userId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteOrganizationUser = async ({
  userId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationUserParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/users/${userId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ORGANIZATION_USERS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteOrganizationUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationUser>>,
      Omit<DeleteOrganizationUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationUserParams,
    Awaited<ReturnType<typeof DeleteOrganizationUser>>
  >(DeleteOrganizationUser, options, {
    domain: "org",
    type: "update",
  });
};
