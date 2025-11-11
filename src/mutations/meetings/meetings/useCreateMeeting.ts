import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { Meeting, ConnectedXMResponse } from "@src/interfaces";
import { MEETINGS_QUERY_KEY, SET_MEETING_QUERY_DATA } from "@src/queries";
import { MeetingCreateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface CreateMeetingParams extends MutationParams {
  meeting: MeetingCreateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const CreateMeeting = async ({
  meeting,
  adminApiParams,
  queryClient,
}: CreateMeetingParams): Promise<ConnectedXMResponse<Meeting>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Meeting>>(
    `/meetings`,
    meeting
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY() });
    SET_MEETING_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useCreateMeeting = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateMeeting>>,
      Omit<CreateMeetingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateMeetingParams,
    Awaited<ReturnType<typeof CreateMeeting>>
  >(CreateMeeting, options);
};
