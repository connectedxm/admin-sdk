import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, IMAGE_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Images
 */
export interface SwitchImageParams extends MutationParams {
  image: any;
  imageId: string;
}

/**
 * @category Methods
 * @group Images
 */
export const SwitchImage = async ({
  image,
  imageId,
  adminApiParams,
  queryClient,
}: SwitchImageParams): Promise<ConnectedXMResponse<Image>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

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

  const { data } = await connectedXM.put<ConnectedXMResponse<Image>>(
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

/**
 * @category Mutations
 * @group Images
 */
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
  >(SwitchImage, options);
};
