import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY } from "@src/queries/events/sessions/useGetEventSessions";
import { EVENT_SESSION_QUERY_KEY } from "@src/queries/events/sessions/useGetEventSession";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionPriceParams extends MutationParams {
  eventId: string;
  sessionId: string;
  priceId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionPrice = async ({
  eventId,
  sessionId,
  priceId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionPriceParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/prices/${priceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionPrice>>,
      Omit<DeleteEventSessionPriceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionPriceParams,
    Awaited<ReturnType<typeof DeleteEventSessionPrice>>
  >(DeleteEventSessionPrice, options);
};
