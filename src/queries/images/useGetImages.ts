import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image, ImageType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Images
 */
export const IMAGES_QUERY_KEY = (type?: ImageType) => {
  const keys = ["IMAGES"];
  if (type) keys.push(type);
  return keys;
};

/**
 * @category Setters
 * @group Images
 */
export const SET_IMAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImages>>
) => {
  client.setQueryData(IMAGES_QUERY_KEY(...keyParams), response);
};

export interface ImageWCopyUri extends Image {
  copyUri: string;
}

interface GetImagePrams extends InfiniteQueryParams {
  type?: ImageType;
}

/**
 * @category Queries
 * @group Images
 */
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
/**
 * @category Hooks
 * @group Images
 */
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
    options
  );
};
