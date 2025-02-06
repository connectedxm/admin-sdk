import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ANNOUNCEMENTS_QUERY_KEY, ANNOUNCEMENT_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific announcement by its ID.
 * This function allows for the removal of an announcement from the system, ensuring that it is no longer accessible.
 * It is designed to be used in administrative contexts where managing announcements is required.
 * @name DeleteAnnouncement
 * @param {string} announcementId (path) - The ID of the announcement to be deleted
 * @version 1.3
 **/
export interface DeleteAnnouncementParams extends MutationParams {
  announcementId: string;
}

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