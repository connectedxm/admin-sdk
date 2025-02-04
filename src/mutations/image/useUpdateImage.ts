import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, SET_IMAGE_QUERY_DATA } from "@src/queries";
import { ImageUpdateInputs } from "@src/params";

/**
 * Endpoint to update an image and invalidate related queries.
 * This function allows updating an image's details using the provided image ID and update inputs.
 * It ensures that any related queries are invalidated to maintain data consistency.
 * @name UpdateImage
 * @param {string} imageId - The id of the image
 * @param {ImageUpdateInputs} image - The image update inputs
 * @version 1.2
 **/
export interface UpdateImageParams extends MutationParams {
  imageId: string;
  image: ImageUpdateInputs;
}

export const UpdateImage = async ({
  imageId,
  image,
  adminApiParams,
  queryClient,
}: UpdateImageParams): Promise<ConnectedXMResponse<Image>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Image>>(
    `/images/${imageId}`,
    image
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
    SET_IMAGE_QUERY_DATA(queryClient, [imageId], data);
  }
  return data;
};

export const useUpdateImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateImage>>,
      Omit<UpdateImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateImageParams,
    Awaited<ReturnType<typeof UpdateImage>>
  >(UpdateImage, options, {
    domain: "storage",
    type: "update",
  });
};