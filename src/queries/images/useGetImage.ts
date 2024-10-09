import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY } from "./useGetImages";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Images
 */
export const IMAGE_QUERY_KEY = (imageId: string) => [
  ...IMAGES_QUERY_KEY(),
  imageId,
];

/**
 * @category Setters
 * @group Images
 */
export const SET_IMAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImage>>
) => {
  client.setQueryData(IMAGE_QUERY_KEY(...keyParams), response);
};

interface GetImageParams extends SingleQueryParams {
  imageId: string | undefined;
}

/**
 * @category Queries
 * @group Images
 */
export const GetImage = async ({
  imageId,
  adminApiParams,
}: GetImageParams): Promise<ConnectedXMResponse<Image>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images/${imageId}`);

  return data;
};
/**
 * @category Hooks
 * @group Images
 */
export const useGetImage = (
  imageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetImage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetImage>>(
    IMAGE_QUERY_KEY(imageId),
    (params: SingleQueryParams) => GetImage({ imageId, ...params }),
    {
      ...options,
      enabled: !!imageId,
    },
    "storage"
  );
};
