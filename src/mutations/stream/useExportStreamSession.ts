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
} from "@src/queries/streams";

/**
 * @category Params
 * @group Stream
 */
export interface ExportStreamSessionParams extends MutationParams {
  streamId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Stream
 */
export const ExportStreamSession = async ({
  streamId,
  sessionId,
  adminApiParams,
  queryClient,
}: ExportStreamSessionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/streams/${streamId}/sessions/${sessionId}/export`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: STREAM_SESSIONS_QUERY_KEY(streamId),
    });
    queryClient.invalidateQueries({
      queryKey: STREAM_SESSION_QUERY_KEY(streamId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
export const useExportStreamSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ExportStreamSession>>,
      Omit<ExportStreamSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ExportStreamSessionParams,
    Awaited<ReturnType<typeof ExportStreamSession>>
  >(ExportStreamSession, options);
};

