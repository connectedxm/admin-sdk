import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventQuestionCreateInputs } from "@src/params";
import {
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  EVENT_QUESTIONS_QUERY_KEY,
  EVENT_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new event question.
 * This function allows the creation of a new question for a specific event, utilizing the provided event ID and question details.
 * It is designed to be used in applications where event management and question registration are required.
 * @name CreateEventQuestion
 * @param {string} eventId - The id of the event
 * @param {EventQuestionCreateInputs} question - The question details
 * @version 1.2
**/
export interface CreateEventQuestionParams extends MutationParams {
  eventId: string;
  question: EventQuestionCreateInputs;
}

export const CreateEventQuestion = async ({
  eventId,
  question,
  adminApiParams,
  queryClient,
}: CreateEventQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/events/${eventId}/questions`, question);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id.toString()],
      data
    );
    if (question.sectionId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_SECTION_QUESTIONS_QUERY_KEY(
          eventId,
          question.sectionId.toString()
        ),
      });
    }

    if (question.questionId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(
          eventId,
          question.questionId.toString()
        ),
      });
    }
  }
  return data;
}

export const useCreateEventQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventQuestion>>,
      Omit<CreateEventQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventQuestionParams,
    Awaited<ReturnType<typeof CreateEventQuestion>>
  >(CreateEventQuestion, options, {
    domain: "events",
    type: "update",
  });
};