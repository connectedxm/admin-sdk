import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Announcement
 */
export interface SendAnnouncementPreviewParams extends MutationParams {
  announcementId: string;
}

/**
 * @category Methods
 * @group Announcement
 */
export const SendAnnouncementPreview = async ({
  announcementId,
  adminApiParams,
}: SendAnnouncementPreviewParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/announcements/${announcementId}/preview`
  );
  return data;
};

/**
 * @category Mutations
 * @group Announcement
 */
export const useSendAnnouncementPreview = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SendAnnouncementPreview>>,
      Omit<SendAnnouncementPreviewParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SendAnnouncementPreviewParams,
    Awaited<ReturnType<typeof SendAnnouncementPreview>>
  >(SendAnnouncementPreview, options);
};
