import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY,
  BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceQuestionChoiceParams extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceQuestionChoice = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceQuestionChoiceParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY(
        placeId,
        spaceId,
        questionId
      ),
    });
    queryClient.removeQueries({
      queryKey: BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY(
        placeId,
        spaceId,
        questionId,
        choiceId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceQuestionChoice>>,
      Omit<
        DeleteBookingSpaceQuestionChoiceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteBookingSpaceQuestionChoice, options);
};
