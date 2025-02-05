import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, IMAGE_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to switch an image by its ID.
 * This function allows users to update an existing image with a new one by providing the image and its ID.
 * It is designed to be used in applications where image management and updates are required.
 * @name SwitchImage
 * @param {any} image - The image to be switched
 * @param {string} imageId - The ID of the image
 * @version 1.2
 **/

export interface SwitchImageParams extends MutationParams {
  image: any;
  imageId: string;
}

export const SwitchImage = async ({
  image,
  imageId,
  adminApiParams,
  queryClient,
}: SwitchImageParams): Promise<ConnectedXMResponse<Image>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const buffer = await new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  const { data } = await adminApi.put<ConnectedXMResponse<Image>>(
    `/images/${imageId}/switch`,
    {
      buffer: buffer || undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: IMAGE_QUERY_KEY(imageId) });
  }
  return data;
};

export const useSwitchImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SwitchImage>>,
      Omit<SwitchImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SwitchImageParams,
    Awaited<ReturnType<typeof SwitchImage>>
  >(SwitchImage, options, {
    domain: "storage",
    type: "update",
  });
};