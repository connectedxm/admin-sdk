import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionSection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionSectionCreateInputs } from "@src/params";
import {
  EVENT_SESSION_SECTIONS_QUERY_KEY,
  SET_EVENT_SESSION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSessionSectionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  section: EventSessionSectionCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSessionSection = async ({
  eventId,
  sessionId,
  section,
  adminApiParams,
  queryClient,
}: CreateEventSessionSectionParams): Promise<
  ConnectedXMResponse<EventSessionSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionSection>
  >(`/events/${eventId}/sessions/${sessionId}/sections`, section);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventSessionSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionSection>>,
      Omit<CreateEventSessionSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionSectionParams,
    Awaited<ReturnType<typeof CreateEventSessionSection>>
  >(CreateEventSessionSection, options, {
    domain: "events",
    type: "update",
  });
};
