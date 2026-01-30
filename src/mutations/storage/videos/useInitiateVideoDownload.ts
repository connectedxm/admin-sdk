import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEOS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Videos
 */
export interface InitiateVideoDownloadParams extends MutationParams {
  videoId: string;
}

/**
 * Response interface for video download initiation
 */
export interface VideoDownloadResult {
  default: {
    status: "inprogress" | "ready" | "error";
    url: string;
    percentComplete: number;
  };
}

/**
 * @category Methods
 * @group Videos
 */
export const InitiateVideoDownload = async ({
  videoId,
  adminApiParams,
  queryClient,
}: InitiateVideoDownloadParams): Promise<
  ConnectedXMResponse<VideoDownloadResult>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<VideoDownloadResult>
  >(`/videos/${videoId}/downloads`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY() });
    // If the video has a download URL ready, update the video query data
    if (data.data?.default?.url) {
      queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY(videoId) });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Videos
 */
export const useInitiateVideoDownload = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof InitiateVideoDownload>>,
      Omit<InitiateVideoDownloadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    InitiateVideoDownloadParams,
    Awaited<ReturnType<typeof InitiateVideoDownload>>
  >(InitiateVideoDownload, options);
};
