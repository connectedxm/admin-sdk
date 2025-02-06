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
 * Endpoint to update the image of the current user.
 * This function allows users to update their profile image by providing the necessary image data.
 * It ensures that the user's image is updated in the system and invalidates the relevant queries to reflect the changes.
 * @name UpdateUserImage
 * @param {UserImageUpdateInputs} image (body) - The image data to update
 * @version 1.3
 **/

export interface UpdateUserImageParams extends MutationParams {
  image: UserImageUpdateInputs;
}

export const UpdateUserImage = async ({
  image,
  adminApiParams,
  queryClient,
}: UpdateUserImageParams): Promise<ConnectedXMResponse<User>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<User>>(
    `/self/image`,
    image
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_QUERY_KEY() });
    SET_SELF_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

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