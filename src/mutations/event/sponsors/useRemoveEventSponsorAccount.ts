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
export interface RemoveEventSponsorAccountParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Sponsors
 */
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

/**
 * @category Mutations
 * @group Event-Sponsors
 */
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
