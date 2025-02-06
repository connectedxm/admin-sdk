import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ANNOUNCEMENTS_QUERY_KEY,
  SET_ANNOUNCEMENT_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to cancel a scheduled announcement.
 * This function allows users to cancel a previously scheduled announcement by providing the announcement ID.
 * It is useful in scenarios where an announcement needs to be retracted or rescheduled.
 * @name CancelAnnouncementSchedule
 * @param {string} announcementId (path) - The ID of the announcement to cancel
 * @version 1.3
 **/

export interface CancelAnnouncementScheduleParams extends MutationParams {
  announcementId: string;
}

export const CancelAnnouncementSchedule = async ({
  announcementId,
  adminApiParams,
  queryClient,
}: CancelAnnouncementScheduleParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Announcement>>(
    `/announcements/${announcementId}/schedule`
  );
  if (queryClient && data.status === "ok") {
    SET_ANNOUNCEMENT_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY() });
  }
  return data;
};

export const useCancelAnnouncementSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelAnnouncementSchedule>>,
      Omit<CancelAnnouncementScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelAnnouncementScheduleParams,
    Awaited<ReturnType<typeof CancelAnnouncementSchedule>>
  >(CancelAnnouncementSchedule, options, {
    domain: "announcements",
    type: "update",
  });
};