import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image } from "@src/interfaces";
import { IMAGE_QUERY_KEY } from "./useGetImage";
import { QueryClient } from "@tanstack/react-query";

export const IMAGE_USAGE_QUERY_KEY = (imageId: string) => [
  ...IMAGE_QUERY_KEY(imageId),
  "USAGE",
];

export const SET_IMAGE_USAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMAGE_USAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImageUsage>>
) => {
  client.setQueryData(IMAGE_USAGE_QUERY_KEY(...keyParams), response);
};

interface GetImageUsageParams {
  imageId: string;
}

interface ImageUsage extends Image {
  _count: {
    accounts: number;
    events: number;
    sessions: number;
    groups: number;
    usage: number;
    speakers: number;
    tickets: number;
  };
}

export const GetImageUsage = async ({
  imageId,
}: GetImageUsageParams): Promise<ConnectedXMResponse<ImageUsage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images/${imageId}/usage`);

  return data;
};

const useGetImageUsage = (imageId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetImageUsage>>(
    IMAGE_USAGE_QUERY_KEY(imageId),
    () => GetImageUsage({ imageId }),
    {
      enabled: !!imageId,
    }
  );
};

export default useGetImageUsage;
