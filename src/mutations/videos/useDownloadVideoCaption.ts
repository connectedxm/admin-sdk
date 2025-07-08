import { GetAdminAPI } from "@src/AdminAPI";
import { MutationParams } from "../useConnectedMutation";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useConnectedXM } from "@src/hooks/useConnectedXM";

/**
 * @category Params
 * @group Videos
 */
export interface DownloadVideoCaptionParams extends MutationParams {
  videoId: string;
  language: string;
}

/**
 * @category Methods
 * @group Videos
 */
export const DownloadVideoCaption = async ({
  videoId,
  language,
  adminApiParams,
}: DownloadVideoCaptionParams): Promise<string> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/videos/${videoId}/captions/${language}/download`,
    {
      responseType: "text",
    }
  );

  return data;
};

/**
 * @category Mutations
 * @group Videos
 */
export const useDownloadVideoCaption = (
  options: UseMutationOptions<
    string,
    AxiosError,
    Omit<DownloadVideoCaptionParams, "queryClient" | "adminApiParams">
  > = {}
) => {
  const { apiUrl, getToken, organizationId, getExecuteAs } = useConnectedXM();

  return useMutation<
    string,
    AxiosError,
    Omit<DownloadVideoCaptionParams, "queryClient" | "adminApiParams">
  >({
    mutationFn: (params) =>
      DownloadVideoCaption({
        ...params,
        adminApiParams: {
          apiUrl,
          getToken,
          organizationId,
          getExecuteAs,
        },
      }),
    ...options,
  });
};
