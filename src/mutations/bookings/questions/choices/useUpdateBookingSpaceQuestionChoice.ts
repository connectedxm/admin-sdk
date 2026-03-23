import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  BookingSpaceQuestionChoice,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestionChoiceUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY,
  SET_BOOKING_SPACE_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceQuestionChoiceParams extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
  choice: BookingSpaceQuestionChoiceUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceQuestionChoice = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  choice,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceQuestionChoiceParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestionChoice>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}`,
    choice
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY(
        placeId,
        spaceId,
        questionId
      ),
    });
    SET_BOOKING_SPACE_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [placeId, spaceId, questionId, choiceId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceQuestionChoice>>,
      Omit<
        UpdateBookingSpaceQuestionChoiceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceQuestionChoiceParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceQuestionChoice>>
  >(UpdateBookingSpaceQuestionChoice, options);
};
