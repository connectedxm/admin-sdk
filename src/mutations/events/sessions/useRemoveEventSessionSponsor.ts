import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SPONSORS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface RemoveEventSessionSponsorParams extends MutationParams {
  eventId: string;
  sessionId: string;
  sponsorId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const RemoveEventSessionSponsor = async ({
  eventId,
  sessionId,
  sponsorId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionSponsorParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/sponsors/${sponsorId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SPONSORS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useRemoveEventSessionSponsor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionSponsor>>,
      Omit<RemoveEventSessionSponsorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionSponsorParams,
    Awaited<ReturnType<typeof RemoveEventSessionSponsor>>
  >(RemoveEventSessionSponsor, options);
};
