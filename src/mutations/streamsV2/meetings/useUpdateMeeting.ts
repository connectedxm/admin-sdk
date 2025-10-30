import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { Meeting, ConnectedXMResponse } from "@src/interfaces";
import { MEETINGS_QUERY_KEY, SET_MEETING_QUERY_DATA } from "@src/queries";
import { MeetingUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface UpdateMeetingParams extends MutationParams {
  meetingId: string;
  meeting: MeetingUpdateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const UpdateMeeting = async ({
  meetingId,
  meeting,
  adminApiParams,
  queryClient,
}: UpdateMeetingParams): Promise<ConnectedXMResponse<Meeting>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.patch<ConnectedXMResponse<Meeting>>(
    `/streams/v2/meetings/${meetingId}`,
    meeting
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY() });
    SET_MEETING_QUERY_DATA(queryClient, [meetingId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useUpdateMeeting = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateMeeting>>,
      Omit<UpdateMeetingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateMeetingParams,
    Awaited<ReturnType<typeof UpdateMeeting>>
  >(UpdateMeeting, options);
};
