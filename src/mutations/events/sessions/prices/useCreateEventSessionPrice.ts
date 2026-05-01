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
export interface CreateEventSessionPriceParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passTypeId: string;
  price: number;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSessionPrice = async ({
  eventId,
  sessionId,
  passTypeId,
  price,
  adminApiParams,
  queryClient,
}: CreateEventSessionPriceParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/prices`,
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
export const useCreateEventSessionPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionPrice>>,
      Omit<CreateEventSessionPriceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionPriceParams,
    Awaited<ReturnType<typeof CreateEventSessionPrice>>
  >(CreateEventSessionPrice, options);
};
