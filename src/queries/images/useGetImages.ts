import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image, ImageType } from "@src/interfaces";
import {
  InfiniteParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const IMAGES_QUERY_KEY = (type?: ImageType) => {
  let keys = ["IMAGES"];
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

export interface ImageWCopyUri extends Image {
  copyUri: string;
}

interface GetImagePrams extends InfiniteParams {
  type?: ImageType;
}

export const GetImages = async ({
  pageParam,
  pageSize,
  orderBy,
  type,
  search,
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

const useGetImages = (type?: ImageType) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetImages>>(
    IMAGES_QUERY_KEY(type),
    (params: InfiniteParams) => GetImages({ ...params, type }),
    {}
  );
};

export default useGetImages;
