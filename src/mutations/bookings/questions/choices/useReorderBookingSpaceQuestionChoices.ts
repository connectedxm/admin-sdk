import { GetAdminAPI } from "@src/AdminAPI";
import {
  BookingSpaceQuestionChoice,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY,
  SET_BOOKING_SPACE_QUESTION_CHOICES_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface ReorderBookingSpaceQuestionChoicesParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choicesIds: string[];
}

/**
 * @category Methods
 * @group Bookings
 */
export const ReorderBookingSpaceQuestionChoices = async ({
  placeId,
  spaceId,
  questionId,
  choicesIds,
  adminApiParams,
  queryClient,
}: ReorderBookingSpaceQuestionChoicesParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoice[]>
> => {
  if (!questionId) throw new Error("Question ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestionChoice[]>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/reorder`,
    {
      choicesIds,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_QUESTION_CHOICES_QUERY_DATA(
      queryClient,
      [placeId, spaceId, questionId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY(
        placeId,
        spaceId,
        questionId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useReorderBookingSpaceQuestionChoices = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderBookingSpaceQuestionChoices>>,
      Omit<
        ReorderBookingSpaceQuestionChoicesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderBookingSpaceQuestionChoicesParams,
    Awaited<ReturnType<typeof ReorderBookingSpaceQuestionChoices>>
  >(ReorderBookingSpaceQuestionChoices, options);
};
