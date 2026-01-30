import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { IMAGES_QUERY_KEY } from "@src/queries";
import { DeleteManyImagesInput } from "@src/params";

/**
 * @category Params
 * @group Images
 */
export interface DeleteManyImagesParams extends MutationParams {
  images: DeleteManyImagesInput;
}

/**
 * @category Methods
 * @group Images
 */
export const DeleteManyImages = async ({
  images,
  adminApiParams,
  queryClient,
}: DeleteManyImagesParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/images/delete`,
    images
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
  >(DeleteManyImages, options);
};
