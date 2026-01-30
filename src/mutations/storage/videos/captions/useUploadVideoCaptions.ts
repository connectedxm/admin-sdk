import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEO_CAPTIONS_QUERY_KEY } from "@src/queries/storage/videos/captions/useGetVideoCaptions";
import { VideoCaption } from "@src/interfaces";

/**
 * @category Params
 * @group Videos
 */
export interface UploadVideoCaptionsParams extends MutationParams {
  videoId: string;
  language: string;
  file: string; // base64 or data URI
  filename?: string;
}

/**
 * @category Methods
 * @group Videos
 */
export const UploadVideoCaptions = async ({
  videoId,
  language,
  file,
  filename,
  adminApiParams,
  queryClient,
}: UploadVideoCaptionsParams): Promise<ConnectedXMResponse<VideoCaption>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<VideoCaption>>(
    `/videos/${videoId}/captions/${language}`,
    {
      file,
      filename,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: VIDEO_CAPTIONS_QUERY_KEY(videoId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Videos
 */
export const useUploadVideoCaptions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UploadVideoCaptions>>,
      Omit<UploadVideoCaptionsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadVideoCaptionsParams,
    Awaited<ReturnType<typeof UploadVideoCaptions>>
  >(UploadVideoCaptions, options);
};
