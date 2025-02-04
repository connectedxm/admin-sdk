import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { IMAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Images
 */
export interface DeleteManyImagesParams extends MutationParams {
  imageIds: string[];
}

/**
 * @category Methods
 * @group Images
 */
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

/**
 * @category Mutations
 * @group Images
 */
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
