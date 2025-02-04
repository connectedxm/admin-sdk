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
 * @category Params
 * @group Self
 */
export interface UpdateSelfParams extends MutationParams {
  user: UserUpdateInputs;
}

/**
 * @category Methods
 * @group Self
 */
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

/**
 * @category Mutations
 * @group Self
 */
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
