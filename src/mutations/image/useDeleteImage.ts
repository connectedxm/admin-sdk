import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { IMAGES_QUERY_KEY, IMAGE_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete an image from the storage.
 * This function allows the removal of a specified image by its ID from the storage system.
 * It ensures that the image is deleted and updates the query cache accordingly.
 * @name DeleteImage
 * @param {string} imageId (path) - The id of the image to be deleted
 * @version 1.3
 **/

export interface DeleteImageParams extends MutationParams {
  imageId: string;
}

export const DeleteImage = async ({
  imageId,
  adminApiParams,
  queryClient,
}: DeleteImageParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/images/${imageId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: IMAGE_QUERY_KEY(imageId) });
  }
  return data;
};

export const useDeleteImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteImage>>,
      Omit<DeleteImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteImageParams,
    Awaited<ReturnType<typeof DeleteImage>>
  >(DeleteImage, options, {
    domain: "storage",
    type: "del",
  });
};