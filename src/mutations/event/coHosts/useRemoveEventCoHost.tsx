import { GetAdminAPI } from "@src/AdminAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Event-CoHosts
 */
export interface RemoveEventCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-CoHosts
 */
export const RemoveEventCoHost = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveEventCoHostParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete(
    `/events/${eventId}/coHosts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_CO_HOSTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-CoHosts
 */
export const useRemoveEventCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventCoHost>>,
      Omit<RemoveEventCoHostParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventCoHostParams,
    Awaited<ReturnType<typeof RemoveEventCoHost>>
  >(RemoveEventCoHost, options);
};
