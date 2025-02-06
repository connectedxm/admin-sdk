import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_USERS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a user from the organization.
 * This function allows administrators to remove a user from the organization's user list.
 * It ensures that the user is properly deleted and the relevant queries are invalidated to maintain data consistency.
 * @name DeleteOrganizationUser
 * @param {string} userId (path) - The id of the user to be deleted
 * @version 1.3
 **/
export interface DeleteOrganizationUserParams extends MutationParams {
  userId: string;
}

export const DeleteOrganizationUser = async ({
  userId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationUserParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/organization/users/${userId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ORGANIZATION_USERS_QUERY_KEY() });
  }
  return data;
};

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