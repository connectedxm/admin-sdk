import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_ACCOUNTS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add an account to a specific event session.
 * This function allows the addition of an account to a designated session within an event, 
 * facilitating the management of session participants.
 * It is intended for use in applications that require dynamic session management capabilities.
 * @name AddEventSessionAccount
 * @param {string} eventId - The id of the event
 * @param {string} sessionId - The id of the session
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/
export interface AddEventSessionAccountParams extends MutationParams {
  eventId: string;
  sessionId: string;
  accountId: string;
}

export const AddEventSessionAccount = async ({
  eventId,
  sessionId,
  accountId,
  adminApiParams,
  queryClient,
}: AddEventSessionAccountParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/accounts/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ACCOUNTS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

export const useAddEventSessionAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionAccount>>,
      Omit<AddEventSessionAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionAccountParams,
    Awaited<ReturnType<typeof AddEventSessionAccount>>
  >(AddEventSessionAccount, options, {
    domain: "events",
    type: "update",
  });
};