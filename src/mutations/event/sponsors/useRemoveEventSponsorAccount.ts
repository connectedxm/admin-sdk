import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORS_QUERY_KEY, SET_EVENT_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to remove a sponsor account from a specific event.
 * This function allows the removal of a sponsor's account from an event by specifying the event and account IDs.
 * It is useful for managing event sponsorships and ensuring that only relevant sponsors are associated with an event.
 * @name RemoveEventSponsorAccount
 * @param {string} eventId (path) - The ID of the event
 * @param {string} accountId (path) - The ID of the sponsor account
 * @version 1.3
**/
export interface RemoveEventSponsorAccountParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const RemoveEventSponsorAccount = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveEventSponsorAccountParams): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Event>>(
    `/events/${eventId}/sponsors/accounts/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
    SET_EVENT_QUERY_DATA(queryClient, [eventId], data);
  }
  return data;
};

export const useRemoveEventSponsorAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSponsorAccount>>,
      Omit<RemoveEventSponsorAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSponsorAccountParams,
    Awaited<ReturnType<typeof RemoveEventSponsorAccount>>
  >(RemoveEventSponsorAccount, options, {
    domain: "events",
    type: "update",
  });
};