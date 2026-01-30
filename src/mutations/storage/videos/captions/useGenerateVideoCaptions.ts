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
export interface GenerateVideoCaptionsParams extends MutationParams {
  videoId: string;
  language: string;
}

/**
 * @category Methods
 * @group Videos
 */
export const GenerateVideoCaptions = async ({
  videoId,
  language,
  adminApiParams,
  queryClient,
}: GenerateVideoCaptionsParams): Promise<ConnectedXMResponse<VideoCaption>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<VideoCaption>>(
    `/videos/${videoId}/captions/${language}/generate`,
    {}
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
export const useGenerateVideoCaptions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof GenerateVideoCaptions>>,
      Omit<GenerateVideoCaptionsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    GenerateVideoCaptionsParams,
    Awaited<ReturnType<typeof GenerateVideoCaptions>>
  >(GenerateVideoCaptions, options);
};
