import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTIONS_QUERY_KEY,
  SET_EVENT_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Questions
 */
export interface CreateEventQuestionParams extends MutationParams {
  eventId: string;
  question: RegistrationQuestion;
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const CreateEventQuestion = async ({
  eventId,
  question,
  adminApiParams,
  queryClient,
}: CreateEventQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Questions
 */
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
  >(CreateEventQuestion, options);
};
