import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SECTIONS_QUERY_KEY,
  SET_EVENT_SESSION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionSectionQuestionParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  questionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionSectionQuestion = async ({
  eventId,
  sessionId,
  sectionId,
  questionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateEventSessionSectionQuestionParams): Promise<
  ConnectedXMResponse<EventSessionSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionSection>
  >(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/questions/${questionId}`,
    {
      sortOrder,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, sectionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionSectionQuestion>>,
      Omit<
        UpdateEventSessionSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionSectionQuestionParams,
    Awaited<ReturnType<typeof UpdateEventSessionSectionQuestion>>
  >(UpdateEventSessionSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};
