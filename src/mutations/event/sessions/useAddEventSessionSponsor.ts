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
 * Adds a sponsor to a specific event session and updates the query client.
 * This function is used to associate a sponsor with a particular session within an event,
 * ensuring that the query client is updated to reflect this change. It is useful in scenarios
 * where event sessions need to be dynamically updated with sponsor information.
 * @name AddEventSessionSponsor
 * @param {string} eventId (path) The id of the event
 * @param {string} sessionId (path) The id of the session
 * @param {string} sponsorId (path) The id of the sponsor
 * @version 1.3
 **/
export interface AddEventSessionSponsorParams extends MutationParams {
  eventId: string;
  sessionId: string;
  sponsorId: string;
}

export const AddEventSessionSponsor = async ({
  eventId,
  sessionId,
  sponsorId,
  adminApiParams,
  queryClient,
}: AddEventSessionSponsorParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSession>>(
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

export const useAddEventSessionSponsor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionSponsor>>,
      Omit<AddEventSessionSponsorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionSponsorParams,
    Awaited<ReturnType<typeof AddEventSessionSponsor>>
  >(AddEventSessionSponsor, options, {
    domain: "events",
    type: "update",
  });
};
