import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY } from "@src/queries/events/sessions/useGetEventSessions";
import { EVENT_SESSION_QUERY_KEY } from "@src/queries/events/sessions/useGetEventSession";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionPriceParams extends MutationParams {
  eventId: string;
  sessionId: string;
  priceId: string;
  passTypeId?: string;
  price?: number;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionPrice = async ({
  eventId,
  sessionId,
  priceId,
  passTypeId,
  price,
  adminApiParams,
  queryClient,
}: UpdateEventSessionPriceParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/prices/${priceId}`,
    {
      passTypeId,
      price,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionPrice>>,
      Omit<UpdateEventSessionPriceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionPriceParams,
    Awaited<ReturnType<typeof UpdateEventSessionPrice>>
  >(UpdateEventSessionPrice, options);
};
