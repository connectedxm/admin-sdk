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
 * Fetches image data from the admin API using a specified image ID.
 * This function is designed to retrieve detailed information about a specific image stored in the system.
 * It is useful for applications that require access to image metadata or content.
 * @name GetImage
 * @param {string} [imageId] (path) The id of the image
 * @version 1.3
 **/

export const IMAGE_QUERY_KEY = (imageId: string) => [
  ...IMAGES_QUERY_KEY(),
  imageId,
];

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

export const GetImage = async ({
  imageId,
  adminApiParams,
}: GetImageParams): Promise<ConnectedXMResponse<Image>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images/${imageId}`);

  return data;
};

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
