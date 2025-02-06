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
 * Endpoint to remove an account from a specific event session.
 * This function allows the removal of an account from a designated event session by specifying the event ID, session ID, and account ID.
 * It is used in scenarios where an account needs to be disassociated from a particular session within an event.
 * @name RemoveEventSessionAccount
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/
export interface RemoveEventSessionAccountParams extends MutationParams {
  eventId: string;
  sessionId: string;
  accountId: string;
}

export const RemoveEventSessionAccount = async ({
  eventId,
  sessionId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionAccountParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventSession>>(
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

export const useRemoveEventSessionAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionAccount>>,
      Omit<RemoveEventSessionAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionAccountParams,
    Awaited<ReturnType<typeof RemoveEventSessionAccount>>
  >(RemoveEventSessionAccount, options, {
    domain: "events",
    type: "update",
  });
};