import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { IMAGES_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete multiple images from the storage system.
 * This function allows users to remove several images at once by providing their IDs.
 * It is useful in scenarios where bulk deletion of images is required, ensuring efficient management of image resources.
 * @name DeleteManyImages
 * @param {string[]} imageIds (bodyValue) - The IDs of the images to be deleted
 * @version 1.3
 **/

export interface DeleteManyImagesParams extends MutationParams {
  imageIds: string[];
}

export const DeleteManyImages = async ({
  imageIds,
  adminApiParams,
  queryClient,
}: DeleteManyImagesParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<null>>(
    `/images/delete`,
    { imageIds }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
  }
  return data;
};

export const useDeleteManyImages = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteManyImages>>,
      Omit<DeleteManyImagesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteManyImagesParams,
    Awaited<ReturnType<typeof DeleteManyImages>>
  >(DeleteManyImages, options, {
    domain: "storage",
    type: "del",
  });
};