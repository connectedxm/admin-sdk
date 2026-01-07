import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  STREAM_SESSIONS_QUERY_KEY,
  STREAM_SESSION_QUERY_KEY,
  STREAM_SESSION_SUBSCRIPTIONS_QUERY_KEY,
} from "@src/queries/streams";

/**
 * @category Params
 * @group Stream
 */
export interface CloseStreamSessionParams extends MutationParams {
  streamId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Stream
 */
export const CloseStreamSession = async ({
  streamId,
  sessionId,
  adminApiParams,
  queryClient,
}: CloseStreamSessionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<null>>(
    `/streams/${streamId}/sessions/${sessionId}/close`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: STREAM_SESSIONS_QUERY_KEY(streamId),
    });
    queryClient.invalidateQueries({
      queryKey: STREAM_SESSION_QUERY_KEY(streamId, sessionId),
    });
    queryClient.invalidateQueries({
      queryKey: STREAM_SESSION_SUBSCRIPTIONS_QUERY_KEY(streamId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
export const useCloseStreamSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CloseStreamSession>>,
      Omit<CloseStreamSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CloseStreamSessionParams,
    Awaited<ReturnType<typeof CloseStreamSession>>
  >(CloseStreamSession, options);
};
