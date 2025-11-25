import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group StreamsV2
 */
export interface JoinMeetingParams extends MutationParams {
  meetingId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const JoinMeeting = async ({
  meetingId,
  adminApiParams,
}: JoinMeetingParams): Promise<ConnectedXMResponse<string>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<ConnectedXMResponse<string>>(
    `/meetings/${meetingId}/join`
  );
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useJoinMeeting = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof JoinMeeting>>,
      Omit<JoinMeetingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinMeetingParams,
    Awaited<ReturnType<typeof JoinMeeting>>
  >(JoinMeeting, options);
};

