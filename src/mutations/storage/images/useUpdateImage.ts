import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, SET_IMAGE_QUERY_DATA } from "@src/queries";
import { ImageUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Images
 */
export interface UpdateImageParams extends MutationParams {
  imageId: string;
  image: ImageUpdateInputs;
}

/**
 * @category Methods
 * @group Images
 */
export const UpdateImage = async ({
  imageId,
  image,
  adminApiParams,
  queryClient,
}: UpdateImageParams): Promise<ConnectedXMResponse<Image>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Image>>(
    `/images/${imageId}`,
    image
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
    SET_IMAGE_QUERY_DATA(queryClient, [imageId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Images
 */
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
  >(UpdateImage, options);
};
