import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY,
  BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceQuestionTranslationParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceQuestionTranslation = async ({
  placeId,
  spaceId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
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
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceQuestionTranslation>>,
      Omit<
        DeleteBookingSpaceQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteBookingSpaceQuestionTranslation>>
  >(DeleteBookingSpaceQuestionTranslation, options);
};
