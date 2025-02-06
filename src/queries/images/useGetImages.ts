import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ImageWCopyUri } from "@src/interfaces";
import { ImageType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve image data with optional filtering by image type.
 * This function allows users to fetch a list of images, optionally filtered by a specified image type.
 * It is designed to be used in applications where image data retrieval is required, with support for infinite scrolling.
 * @name GetImages
 * @param {string} [type] (query) - Optional image type for filtering
 * @version 1.3
 **/

export const IMAGES_QUERY_KEY = (type?: ImageType) => {
  const keys = ["IMAGES"];
  if (type) keys.push(type);
  return keys;
};

export const SET_IMAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImages>>
) => {
  client.setQueryData(IMAGES_QUERY_KEY(...keyParams), response);
};

interface GetImagePrams extends InfiniteQueryParams {
  type?: ImageType;
}

export const GetImages = async ({
  pageParam,
  pageSize,
  orderBy,
  type,
  search,
  adminApiParams,
}: GetImagePrams): Promise<ConnectedXMResponse<ImageWCopyUri[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      type: type || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetImages = (
  type?: ImageType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetImages>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetImages>>>(
    IMAGES_QUERY_KEY(type),
    (params: InfiniteQueryParams) => GetImages({ ...params, type }),
    params,
    options,
    "storage"
  );
};