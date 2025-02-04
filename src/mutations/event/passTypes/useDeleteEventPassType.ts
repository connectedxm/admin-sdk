import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPES_QUERY_KEY,
  EVENT_PASS_TYPE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-PassTypes
 */
export interface DeleteEventPassTypeParams extends MutationParams {
  eventId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const DeleteEventPassType = async ({
  eventId,
  passTypeId,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypeParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/passTypes/${passTypeId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes
 */
export const useDeleteEventPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassType>>,
      Omit<DeleteEventPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassTypeParams,
    Awaited<ReturnType<typeof DeleteEventPassType>>
  >(DeleteEventPassType, options, {
    domain: "events",
    type: "update",
  });
};
