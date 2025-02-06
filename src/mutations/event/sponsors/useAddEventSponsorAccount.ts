import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORS_QUERY_KEY, SET_EVENT_QUERY_DATA } from "@src/queries";

/**
 * Adds a sponsor account to a specific event and updates the query client if successful.
 * This function is used to associate a sponsor's account with an event, allowing for the management of event sponsorships.
 * It ensures that the query client is updated to reflect the changes if the operation is successful.
 * @name AddEventSponsorAccount
 * @param {string} eventId (path) - The id of the event
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/
export interface AddEventSponsorAccountParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const AddEventSponsorAccount = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: AddEventSponsorAccountParams): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Event>>(
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

export const useAddEventSponsorAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSponsorAccount>>,
      Omit<AddEventSponsorAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSponsorAccountParams,
    Awaited<ReturnType<typeof AddEventSponsorAccount>>
  >(AddEventSponsorAccount, options, {
    domain: "events",
    type: "update",
  });
};