import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionCloneOptions } from "@src/params";
import { EVENT_SESSIONS_QUERY_KEY } from "@src/queries";

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
}: CloneEventSessionParams): Promise<
  ConnectedXMResponse<{ id: string; slug: string }>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<{ id: string; slug: string }>
  >(`/events/${eventId}/sessions/${sessionId}/clone`, options);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
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
