import { GetAdminAPI } from "@src/AdminAPI";
import { EventSession, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionCloneOptions } from "@src/params";
import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface CloneEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  options?: EventSessionCloneOptions;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const CloneEventSession = async ({
  eventId,
  sessionId,
  options = {},
  adminApiParams,
  queryClient,
}: CloneEventSessionParams): Promise<ConnectedXMResponse<EventSession>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/clone`,
    options
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useCloneEventSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CloneEventSession>>,
      Omit<CloneEventSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CloneEventSessionParams,
    Awaited<ReturnType<typeof CloneEventSession>>
  >(CloneEventSession, options);
};
