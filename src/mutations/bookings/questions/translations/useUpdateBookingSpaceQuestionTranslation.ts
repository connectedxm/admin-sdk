import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  BookingSpaceQuestionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestionTranslationUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_QUESTION_QUERY_KEY,
  BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY,
  BOOKING_SPACE_QUESTIONS_QUERY_KEY,
  BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceQuestionTranslationParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  locale: string;
  questionTranslation: BookingSpaceQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceQuestionTranslation = async ({
  placeId,
  spaceId,
  questionId,
  locale,
  questionTranslation,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceQuestionTranslationParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestionTranslation>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/translations/${locale}`,
    questionTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY(
        placeId,
        spaceId,
        questionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY(
        placeId,
        spaceId,
        questionId,
        locale
      ),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceQuestionTranslation>>,
      Omit<
        UpdateBookingSpaceQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceQuestionTranslation>>
  >(UpdateBookingSpaceQuestionTranslation, options);
};
