import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_VISIBLE_PASS_TYPES_QUERY_KEY } from "@src/queries/events/sessions/useGetEventSessionVisiblePassTypes";

/**
 * @category Params
 * @group Events
 */
export interface AddEventSessionVisiblePassTypeParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventSessionVisiblePassType = async ({
  eventId,
  sessionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: AddEventSessionVisiblePassTypeParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/visiblePassTypes/${passTypeId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_VISIBLE_PASS_TYPES_QUERY_KEY(eventId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useAddEventSessionVisiblePassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionVisiblePassType>>,
      Omit<
        AddEventSessionVisiblePassTypeParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionVisiblePassTypeParams,
    Awaited<ReturnType<typeof AddEventSessionVisiblePassType>>
  >(AddEventSessionVisiblePassType, options);
};
