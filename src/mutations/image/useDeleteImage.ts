import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { IMAGES_QUERY_KEY, IMAGE_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Images
 */
export interface DeleteImageParams extends MutationParams {
  imageId: string;
}

/**
 * @category Methods
 * @group Images
 */
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

/**
 * @category Mutations
 * @group Images
 */
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
