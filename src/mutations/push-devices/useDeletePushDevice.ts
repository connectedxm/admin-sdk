import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { PUSH_DEVICE_QUERY_KEY, PUSH_DEVICES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface DeletePushDeviceParams extends MutationParams {
  pushDeviceId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const DeletePushDevice = async ({
  pushDeviceId,
  adminApiParams,
  queryClient,
}: DeletePushDeviceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/push-devices/${pushDeviceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: PUSH_DEVICES_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: PUSH_DEVICE_QUERY_KEY(pushDeviceId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useDeletePushDevice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeletePushDevice>>,
      Omit<DeletePushDeviceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeletePushDeviceParams,
    Awaited<ReturnType<typeof DeletePushDevice>>
  >(DeletePushDevice, options, {
    domain: "accounts",
    type: "update",
  });
};
