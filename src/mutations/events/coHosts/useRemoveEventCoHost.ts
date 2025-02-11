import { GetAdminAPI } from "@src/AdminAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_CO_HOSTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a co-host from an event.
 * This function allows the removal of a specified account as a co-host from a given event.
 * It is useful in scenarios where event management requires updating the list of co-hosts.
 * @name RemoveEventCoHost
 * @param {string} eventId (path) The id of the event
 * @param {string} accountId (path) The id of the account to be removed as co-host
 * @version 1.3
 **/
export interface RemoveEventCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const RemoveEventCoHost = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveEventCoHostParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/coHosts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_CO_HOSTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useRemoveEventCoHost = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventCoHost>>,
      Omit<RemoveEventCoHostParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventCoHostParams,
    Awaited<ReturnType<typeof RemoveEventCoHost>>
  >(RemoveEventCoHost, options, {
    domain: "events",
    type: "update",
  });
};
