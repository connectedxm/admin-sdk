import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ANNOUNCEMENTS_QUERY_KEY, ANNOUNCEMENT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Announcement
 */
export interface DeleteAnnouncementParams extends MutationParams {
  announcementId: string;
}

/**
 * @category Methods
 * @group Announcement
 */
export const DeleteAnnouncement = async ({
  announcementId,
  adminApiParams,
  queryClient,
}: DeleteAnnouncementParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/announcements/${announcementId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: ANNOUNCEMENT_QUERY_KEY(announcementId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Announcement
 */
export const useDeleteAnnouncement = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAnnouncement>>,
      Omit<DeleteAnnouncementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAnnouncementParams,
    Awaited<ReturnType<typeof DeleteAnnouncement>>
  >(DeleteAnnouncement, options, {
    domain: "announcements",
    type: "del",
  });
};
