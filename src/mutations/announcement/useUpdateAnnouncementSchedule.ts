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
 * Endpoint to update the schedule for a specific announcement.
 * This function allows updating the schedule details of an announcement, including the date and optional notification settings.
 * It is designed to be used in applications where managing announcement schedules is required.
 * @name UpdateAnnouncementSchedule
 * @param {string} announcementId (path) - The id of the announcement
 * @param {Object} schedule (body) - The schedule details
 * @param {string} schedule.date (bodyValue) - The date of the schedule
 * @param {boolean} [schedule.email] (bodyValue) - Optional email notification flag
 * @param {boolean} [schedule.push] (bodyValue) - Optional push notification flag
 * @version 1.3
 **/
export interface UpdateAnnouncementScheduleParams extends MutationParams {
  announcementId: string;
  schedule: {
    date: string;
    email?: boolean;
    push?: boolean;
  };
}

export const UpdateAnnouncementSchedule = async ({
  announcementId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateAnnouncementScheduleParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Announcement>>(
    `/announcements/${announcementId}/schedule`,
    schedule
  );
  if (queryClient && data.status === "ok") {
    SET_ANNOUNCEMENT_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY() });
  }
  return data;
};

export const useUpdateAnnouncementSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAnnouncementSchedule>>,
      Omit<UpdateAnnouncementScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAnnouncementScheduleParams,
    Awaited<ReturnType<typeof UpdateAnnouncementSchedule>>
  >(UpdateAnnouncementSchedule, options, {
    domain: "announcements",
    type: "update",
  });
};