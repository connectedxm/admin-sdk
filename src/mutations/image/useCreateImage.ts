import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, SET_IMAGE_QUERY_DATA } from "@src/queries";
import { ImageCreateInputs } from "@src/params";

/**
 * Endpoint to create a new image in the system.
 * This function allows users to upload and store a new image by providing the necessary image data.
 * It is designed to be used in applications where image management and storage are required.
 * @name CreateImage
 * @param {ImageCreateInputs} image - The image data to be created
 * @version 1.2
 **/

export interface CreateImageParams extends MutationParams {
  image: ImageCreateInputs;
}

export const CreateImage = async ({
  image,
  adminApiParams,
  queryClient,
}: CreateImageParams): Promise<ConnectedXMResponse<Image>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<Image>>(
    `/images`,
    image
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
    SET_IMAGE_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

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
  >(CreateImage, options, {
    domain: "storage",
    type: "create",
  });
};