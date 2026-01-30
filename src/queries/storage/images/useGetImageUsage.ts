import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, ImageUsage } from "@src/interfaces";
import { IMAGE_QUERY_KEY } from "./useGetImage";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Images
 */
export const IMAGE_USAGE_QUERY_KEY = (imageId: string) => [
  ...IMAGE_QUERY_KEY(imageId),
  "USAGE",
];

/**
 * @category Setters
 * @group Images
 */
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

/**
 * @category Queries
 * @group Images
 */
export const GetImageUsage = async ({
  imageId,
  adminApiParams,
}: GetImageUsageParams): Promise<ConnectedXMResponse<ImageUsage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images/${imageId}/usage`);

  return data;
};
/**
 * @category Hooks
 * @group Images
 */
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
    }
  );
};
