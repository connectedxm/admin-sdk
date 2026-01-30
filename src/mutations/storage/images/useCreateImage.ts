import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, SET_IMAGE_QUERY_DATA } from "@src/queries";
import { ImageCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Images
 */
export interface CreateImageParams extends MutationParams {
  image: ImageCreateInputs;
}

/**
 * @category Methods
 * @group Images
 */
export const CreateImage = async ({
  image,
  adminApiParams,
  queryClient,
}: CreateImageParams): Promise<ConnectedXMResponse<Image>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<Image>>(
    `/images`,
    image
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
    SET_IMAGE_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Images
 */
export const useCreateImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateImage>>,
      Omit<CreateImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateImageParams,
    Awaited<ReturnType<typeof CreateImage>>
  >(CreateImage, options);
};
