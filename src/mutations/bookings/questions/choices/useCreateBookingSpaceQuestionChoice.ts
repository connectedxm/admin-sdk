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
import { BookingSpaceQuestionChoiceCreateInputs } from "@src/params";
import {
  BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY,
  SET_BOOKING_SPACE_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingSpaceQuestionChoiceParams extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choice: BookingSpaceQuestionChoiceCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpaceQuestionChoice = async ({
  placeId,
  spaceId,
  questionId,
  choice,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceQuestionChoiceParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingSpaceQuestionChoice>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices`,
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
    if (data.data?.id) {
      SET_BOOKING_SPACE_QUESTION_CHOICE_QUERY_DATA(
        queryClient,
        [placeId, spaceId, questionId, data.data.id],
        data
      );
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useCreateBookingSpaceQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingSpaceQuestionChoice>>,
      Omit<
        CreateBookingSpaceQuestionChoiceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingSpaceQuestionChoiceParams,
    Awaited<ReturnType<typeof CreateBookingSpaceQuestionChoice>>
  >(CreateBookingSpaceQuestionChoice, options);
};
