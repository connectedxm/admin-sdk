import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionSection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionSectionUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_SECTIONS_QUERY_KEY,
  SET_EVENT_SESSION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionSectionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  section: EventSessionSectionUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionSection = async ({
  eventId,
  sessionId,
  sectionId,
  section,
  adminApiParams,
  queryClient,
}: UpdateEventSessionSectionParams): Promise<
  ConnectedXMResponse<EventSessionSection>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionSection>
  >(`/events/${eventId}/sessions/${sessionId}/sections/${sectionId}`, {
    ...section,
    id: undefined,
    sessionId: undefined,
    questions: undefined,
    eventSessionTickets: undefined,
    accountTiers: undefined,
    _count: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, sectionId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionSection>>,
      Omit<UpdateEventSessionSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionSectionParams,
    Awaited<ReturnType<typeof UpdateEventSessionSection>>
  >(UpdateEventSessionSection, options);
};
