import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TIME_QUERY_KEY,
  EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY,
  EVENT_SESSION_TIMES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionTimeParams extends MutationParams {
  eventId: string;
  sessionId: string;
  timeId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionTime = async ({
  eventId,
  sessionId,
  timeId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionTimeParams): Promise<
  ConnectedXMResponse<{ deleted: boolean }>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<{ deleted: boolean }>
  >(`/events/${eventId}/sessions/${sessionId}/times/${timeId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIMES_QUERY_KEY(eventId, sessionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        timeId
      ),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_TIME_QUERY_KEY(eventId, sessionId, timeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionTime = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionTime>>,
      Omit<DeleteEventSessionTimeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionTimeParams,
    Awaited<ReturnType<typeof DeleteEventSessionTime>>
  >(DeleteEventSessionTime, options);
};
