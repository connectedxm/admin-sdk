import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Video } from "@src/interfaces";
import { VIDEOS_QUERY_KEY } from "./useGetVideos";
import { QueryClient } from "@tanstack/react-query";

export const VIDEO_QUERY_KEY = (videoId: string) => [
  ...VIDEOS_QUERY_KEY(""),
  videoId,
];

export const SET_VIDEO_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof VIDEO_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetVideo>>
) => {
  client.setQueryData(VIDEO_QUERY_KEY(...keyParams), response);
};

interface GetVideoParams {
  videoId: string;
}

export const GetVideo = async ({
  videoId,
}: GetVideoParams): Promise<ConnectedXMResponse<Video>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/videos/${videoId}`);

  return data;
};

const useGetVideo = (videoId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetVideo>>(
    VIDEO_QUERY_KEY(videoId),
    () => GetVideo({ videoId }),
    {
      enabled: !!videoId,
    }
  );
};

export default useGetVideo;
