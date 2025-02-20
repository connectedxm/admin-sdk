import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_LEAD_QUERY_KEY, ACCOUNT_LEADS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface DeleteAccountPushDeviceParams extends MutationParams {
  accountId: string;
  pushDeviceId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const DeleteAccountPushDevice = async ({
  accountId,
  pushDeviceId,
  adminApiParams,
  queryClient,
}: DeleteAccountPushDeviceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/push-devices/${pushDeviceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEADS_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEAD_QUERY_KEY(accountId, pushDeviceId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useDeleteAccountPushDevice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAccountPushDevice>>,
      Omit<DeleteAccountPushDeviceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAccountPushDeviceParams,
    Awaited<ReturnType<typeof DeleteAccountPushDevice>>
  >(DeleteAccountPushDevice, options, {
    domain: "accounts",
    type: "update",
  });
};
