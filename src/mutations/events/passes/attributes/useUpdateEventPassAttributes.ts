import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PassAttribute } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassAttributesUpdateInputs } from "@src/params";
import { EVENT_PASS_ATTRIBUTES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface UpdateEventPassAttributesParams extends MutationParams {
  eventId: string;
  passId: string;
  values: PassAttributesUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const UpdateEventPassAttributes = async ({
  eventId,
  passId,
  values,
  adminApiParams,
  queryClient,
}: UpdateEventPassAttributesParams): Promise<
  ConnectedXMResponse<PassAttribute[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<PassAttribute[]>>(
    `/events/${eventId}/passes/${passId}/attributes`,
    values
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ATTRIBUTES_QUERY_KEY(eventId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useUpdateEventPassAttributes = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassAttributes>>,
      Omit<UpdateEventPassAttributesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassAttributesParams,
    Awaited<ReturnType<typeof UpdateEventPassAttributes>>
  >(UpdateEventPassAttributes, options);
};
