import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORS_QUERY_KEY, SET_EVENT_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Sponsors
 */
export interface AddEventSponsorAccountParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Sponsors
 */
export const AddEventSponsorAccount = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: AddEventSponsorAccountParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Event>>(
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

/**
 * @category Mutations
 * @group Event-Sponsors
 */
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
