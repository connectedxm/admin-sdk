import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  BookingSpaceQuestionChoiceTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestionChoiceTranslationUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceQuestionChoiceTranslationParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
  locale: string;
  choiceTranslation: BookingSpaceQuestionChoiceTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceQuestionChoiceTranslation = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  locale,
  choiceTranslation,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceQuestionChoiceTranslationParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoiceTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestionChoiceTranslation>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`,
    choiceTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
        placeId,
        spaceId,
        questionId,
        choiceId
      ),
    });
    SET_BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_DATA(
      queryClient,
      [placeId, spaceId, questionId, choiceId, data.data?.locale ?? locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceQuestionChoiceTranslation>>,
      Omit<
        UpdateBookingSpaceQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceQuestionChoiceTranslation>>
  >(UpdateBookingSpaceQuestionChoiceTranslation, options);
};
