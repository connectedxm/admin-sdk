import { GetAdminAPI } from "@src/AdminAPI";
import { EventPassType, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypeUpdateInputs } from "@src/params";
import {
  EVENT_PASS_TYPES_QUERY_KEY,
  SET_EVENT_PASS_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-PassTypes
 */
export interface UpdateEventPassTypeParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  passType: PassTypeUpdateInputs;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const UpdateEventPassType = async ({
  eventId,
  passTypeId,
  passType,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypeParams): Promise<ConnectedXMResponse<EventPassType>> => {
  if (!passTypeId) throw new Error("PassType ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes/${passTypeId}`,
    {
      ...passType,
      id: undefined,
      featuredImage: undefined,
      allowedTiers: undefined,
      event: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPES_QUERY_KEY(eventId),
    });
    SET_EVENT_PASS_TYPE_QUERY_DATA(
      queryClient,
      [eventId, passTypeId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes
 */
export const useUpdateEventPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassType>>,
      Omit<UpdateEventPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassTypeParams,
    Awaited<ReturnType<typeof UpdateEventPassType>>
  >(UpdateEventPassType, options, {
    domain: "events",
    type: "update",
  });
};
