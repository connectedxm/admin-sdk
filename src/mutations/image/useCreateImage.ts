import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY, SET_IMAGE_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Images
 */
export interface CreateImageParams extends MutationParams {
  image: Blob;
  name: string;
  description: string;
  type: "admin" | "account" | "activity";
}

/**
 * @category Methods
 * @group Images
 */
export const CreateImage = async ({
  image,
  name,
  description,
  type,
  adminApiParams,
  queryClient,
}: CreateImageParams): Promise<ConnectedXMResponse<Image>> => {
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

  const { data } = await connectedXM.post<ConnectedXMResponse<Image>>(
    `/images`,
    {
      buffer: buffer || undefined,
      name: name || undefined,
      description: description || undefined,
      type: type || undefined,
    }
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
