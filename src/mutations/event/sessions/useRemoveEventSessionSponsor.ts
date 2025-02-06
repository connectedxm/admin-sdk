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
 * Endpoint to remove a sponsor from a specific event session.
 * This function allows the removal of a sponsor from an event session by specifying the event, session, and sponsor IDs.
 * It is designed to be used in applications where managing event session sponsors is required.
 * @name RemoveEventSessionSponsor
 * @param {string} eventId (path) The id of the event
 * @param {string} sessionId (path) The id of the session
 * @param {string} sponsorId (path) The id of the sponsor
 * @version 1.3
 **/
export interface RemoveEventSessionSponsorParams extends MutationParams {
  eventId: string;
  sessionId: string;
  sponsorId: string;
}

export const RemoveEventSessionSponsor = async ({
  eventId,
  sessionId,
  sponsorId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionSponsorParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventSession>>(
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
  >(RemoveEventSessionSponsor, options, {
    domain: "events",
    type: "update",
  });
};
