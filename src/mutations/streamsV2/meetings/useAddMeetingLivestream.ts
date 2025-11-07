import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Livestream } from "@src/interfaces";
import {
  MEETINGS_QUERY_KEY,
  SET_MEETING_LIVESTREAM_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface AddMeetingLivestreamParams extends MutationParams {
  meetingId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const AddMeetingLivestream = async ({
  meetingId,
  adminApiParams,
  queryClient,
}: AddMeetingLivestreamParams): Promise<ConnectedXMResponse<Livestream>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Livestream>>(
    `/streams/v2/meetings/${meetingId}/livestream`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY() });
    SET_MEETING_LIVESTREAM_QUERY_DATA(queryClient, [meetingId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useAddMeetingLivestream = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddMeetingLivestream>>,
      Omit<AddMeetingLivestreamParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddMeetingLivestreamParams,
    Awaited<ReturnType<typeof AddMeetingLivestream>>
  >(AddMeetingLivestream, options);
};
