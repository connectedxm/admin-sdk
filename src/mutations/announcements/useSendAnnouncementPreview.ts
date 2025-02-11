import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to send a preview of an announcement.
 * This function triggers the sending of a preview for a specific announcement, identified by its ID.
 * It is designed to be used in applications where previewing announcements before sending is required.
 * @name SendAnnouncementPreview
 * @param {string} announcementId (path) The ID of the announcement to preview
 * @version 1.3
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
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<null>>(
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
  >(SendAnnouncementPreview, options, {
    domain: "announcements",
    type: "update",
  });
};
