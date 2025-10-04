import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEOS_QUERY_KEY } from "./useGetVideos";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Response interface for video download status
 */
export interface VideoDownloadStatus {
  default: {
    status: "inprogress" | "ready" | "error";
    url: string;
    percentComplete: number;
  };
}

/**
 * @category Keys
 * @group Videos
 */
export const VIDEO_DOWNLOAD_STATUS_QUERY_KEY = (videoId: string) => [
  ...VIDEOS_QUERY_KEY(""),
  videoId,
  "download-status",
];

/**
 * @category Setters
 * @group Videos
 */
export const SET_VIDEO_DOWNLOAD_STATUS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof VIDEO_DOWNLOAD_STATUS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetVideoDownloadStatus>>
) => {
  client.setQueryData(VIDEO_DOWNLOAD_STATUS_QUERY_KEY(...keyParams), response);
};

interface GetVideoDownloadStatusParams extends SingleQueryParams {
  videoId: string;
}

/**
 * @category Queries
 * @group Videos
 */
export const GetVideoDownloadStatus = async ({
  videoId,
  adminApiParams,
}: GetVideoDownloadStatusParams): Promise<
  ConnectedXMResponse<VideoDownloadStatus>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/videos/${videoId}/downloads`);

  return data;
};

/**
 * @category Hooks
 * @group Videos
 */
export const useGetVideoDownloadStatus = (
  videoId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetVideoDownloadStatus>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetVideoDownloadStatus>>(
    VIDEO_DOWNLOAD_STATUS_QUERY_KEY(videoId),
    (params: SingleQueryParams) =>
      GetVideoDownloadStatus({ videoId, ...params }),
    {
      ...options,
      enabled: !!videoId && (options?.enabled ?? true),
    }
  );
};
