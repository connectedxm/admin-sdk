import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, User } from "@src/interfaces";
import { SELF_QUERY_KEY, SET_SELF_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Images
 */
export interface DeleteUserImageParams extends MutationParams {}

/**
 * @category Methods
 * @group Images
 */
export const DeleteUserImage = async ({
  adminApiParams,
  queryClient,
}: DeleteUserImageParams): Promise<ConnectedXMResponse<User>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<User>>(
    `/self/image`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_QUERY_KEY() });
    SET_SELF_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Images
 */
export const useDeleteUserImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteUserImage>>,
      Omit<DeleteUserImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteUserImageParams,
    Awaited<ReturnType<typeof DeleteUserImage>>
  >(DeleteUserImage, options);
};
