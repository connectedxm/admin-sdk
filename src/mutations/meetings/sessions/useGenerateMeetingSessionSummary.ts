import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { MEETING_SESSION_SUMMARY_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface GenerateMeetingSessionSummaryParams extends MutationParams {
  sessionId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const GenerateMeetingSessionSummary = async ({
  sessionId,
  adminApiParams,
  queryClient,
}: GenerateMeetingSessionSummaryParams): Promise<ConnectedXMResponse<any>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<any>>(
    `/meetings/sessions/${sessionId}/summary`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEETING_SESSION_SUMMARY_QUERY_KEY(sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useGenerateMeetingSessionSummary = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof GenerateMeetingSessionSummary>>,
      Omit<
        GenerateMeetingSessionSummaryParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    GenerateMeetingSessionSummaryParams,
    Awaited<ReturnType<typeof GenerateMeetingSessionSummary>>
  >(GenerateMeetingSessionSummary, options);
};
