import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { User, ConnectedXMResponse } from "@src/interfaces";
import { SET_SELF_QUERY_DATA } from "@src/queries";
import { UserUpdateInputs } from "@src/params";

/**
 * Endpoint to update the current user's data.
 * This function allows users to update their own profile information by providing the necessary user data.
 * It ensures that the updated information is reflected in the application by setting the query data accordingly.
 * @name UpdateSelf
 * @param {UserUpdateInputs} user (body) The user data to update
 * @version 1.3
 **/

export interface UpdateSelfParams extends MutationParams {
  user: UserUpdateInputs;
}

export const UpdateSelf = async ({
  user,
  adminApiParams,
  queryClient,
}: UpdateSelfParams): Promise<ConnectedXMResponse<User>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<User>>(`/self`, user);
  if (queryClient && data.status === "ok") {
    SET_SELF_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

export const useUpdateSelf = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSelf>>,
      Omit<UpdateSelfParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfParams,
    Awaited<ReturnType<typeof UpdateSelf>>
  >(UpdateSelf, options);
};
