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

/**
 * Retrieves usage data for a specific image.
 * This function fetches detailed usage statistics for an image, including counts of associated accounts, events, sessions, groups, usage, speakers, and tickets.
 * It is intended for use in applications that require insights into how an image is being utilized across different entities.
 * @name GetImageUsage
 * @param {string} imageId - The id of the image
 * @version 1.2
 **/

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

interface GetImageUsageParams extends SingleQueryParams {
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
  adminApiParams,
}: GetImageUsageParams): Promise<ConnectedXMResponse<ImageUsage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images/${imageId}/usage`);

  return data;
};

export const useGetImageUsage = (
  imageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetImageUsage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetImageUsage>>(
    IMAGE_USAGE_QUERY_KEY(imageId),
    (params) => GetImageUsage({ imageId, ...params }),
    {
      ...options,
      enabled: !!imageId && (options?.enabled ?? true),
    },
    "storage"
  );
};