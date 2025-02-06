import { GetAdminAPI } from "@src/AdminAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_CO_HOSTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add a co-host to a specific event.
 * This function allows the addition of an account as a co-host to an event by specifying the event ID and account ID.
 * It is used in scenarios where event management requires assigning co-host roles to different accounts.
 * @name AddEventCoHost
 * @param {string} eventId (path) The id of the event
 * @param {string} accountId (path) The id of the account to be added as co-host
 * @version 1.3
 **/
export interface AddEventCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const AddEventCoHost = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: AddEventCoHostParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/coHosts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_CO_HOSTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useAddEventCoHost = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventCoHost>>,
      Omit<AddEventCoHostParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventCoHostParams,
    Awaited<ReturnType<typeof AddEventCoHost>>
  >(AddEventCoHost, options, {
    domain: "events",
    type: "update",
  });
};
