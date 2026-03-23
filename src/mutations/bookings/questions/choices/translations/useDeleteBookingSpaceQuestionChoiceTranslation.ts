import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceQuestionChoiceTranslationParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceQuestionChoiceTranslation = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
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
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
        placeId,
        spaceId,
        questionId,
        choiceId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceQuestionChoiceTranslation>>,
      Omit<
        DeleteBookingSpaceQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof DeleteBookingSpaceQuestionChoiceTranslation>>
  >(DeleteBookingSpaceQuestionChoiceTranslation, options);
};
