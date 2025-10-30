import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SESSION_SUMMARY_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface GenerateSessionSummaryParams extends MutationParams {
  meetingId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const GenerateSessionSummary = async ({
  meetingId,
  sessionId,
  adminApiParams,
  queryClient,
}: GenerateSessionSummaryParams): Promise<ConnectedXMResponse<any>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<any>>(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}/summary`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SESSION_SUMMARY_QUERY_KEY(meetingId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useGenerateSessionSummary = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof GenerateSessionSummary>>,
      Omit<GenerateSessionSummaryParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    GenerateSessionSummaryParams,
    Awaited<ReturnType<typeof GenerateSessionSummary>>
  >(GenerateSessionSummary, options);
};
