import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_PASS_TYPES_QUERY_KEY } from "@src/queries/events/sessions/useGetEventSessionPassTypes";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventSessionPassTypeParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventSessionPassType = async ({
  eventId,
  sessionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionPassTypeParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/passTypes/${passTypeId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_PASS_TYPES_QUERY_KEY(eventId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useRemoveEventSessionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionPassType>>,
      Omit<RemoveEventSessionPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventSessionPassType>>
  >(RemoveEventSessionPassType, options, {
    domain: "events",
    type: "update",
  });
};
