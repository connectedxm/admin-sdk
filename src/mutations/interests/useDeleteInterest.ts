import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { INTERESTS_QUERY_KEY, INTEREST_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Interest
 */
export interface DeleteInterestParams extends MutationParams {
  interestId: string;
}

/**
 * @category Methods
 * @group Interest
 */
export const DeleteInterest = async ({
  interestId,
  adminApiParams,
  queryClient,
}: DeleteInterestParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/interests/${interestId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTERESTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: INTEREST_QUERY_KEY(interestId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Interest
 */
export const useDeleteInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteInterest>>,
      Omit<DeleteInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteInterestParams,
    Awaited<ReturnType<typeof DeleteInterest>>
  >(DeleteInterest, options);
};
