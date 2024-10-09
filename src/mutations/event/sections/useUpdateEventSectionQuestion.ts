import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTIONS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface UpdateEventSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const UpdateEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/questions/${questionId}`, {
    sortOrder,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useUpdateEventSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSectionQuestion>>,
      Omit<UpdateEventSectionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSectionQuestionParams,
    Awaited<ReturnType<typeof UpdateEventSectionQuestion>>
  >(UpdateEventSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};
