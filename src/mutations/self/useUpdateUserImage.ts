import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, User } from "@src/interfaces";
import { SELF_QUERY_KEY, SET_SELF_QUERY_DATA } from "@src/queries";
import { UserImageUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Images
 */
export interface UpdateUserImageParams extends MutationParams {
  image: UserImageUpdateInputs;
}

/**
 * @category Methods
 * @group Images
 */
export const UpdateUserImage = async ({
  image,
  adminApiParams,
  queryClient,
}: UpdateUserImageParams): Promise<ConnectedXMResponse<User>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<User>>(
    `/self/image`,
    image
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
export const useUpdateUserImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateUserImage>>,
      Omit<UpdateUserImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateUserImageParams,
    Awaited<ReturnType<typeof UpdateUserImage>>
  >(UpdateUserImage, options);
};
