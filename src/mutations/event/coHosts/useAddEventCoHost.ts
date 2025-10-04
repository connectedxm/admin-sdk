import { GetAdminAPI } from "@src/AdminAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_CO_HOSTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-CoHosts
 */
export interface AddEventCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-CoHosts
 */
export const AddEventCoHost = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: AddEventCoHostParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
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
  >(AddEventCoHost, options);
};
