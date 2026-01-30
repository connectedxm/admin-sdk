import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { Interest, ConnectedXMResponse } from "@src/interfaces";
import { INTERESTS_QUERY_KEY, SET_INTEREST_QUERY_DATA } from "@src/queries";
import { InterestCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Interest
 */
export interface CreateInterestParams extends MutationParams {
  interest: InterestCreateInputs;
}

/**
 * @category Methods
 * @group Interest
 */
export const CreateInterest = async ({
  interest,
  adminApiParams,
  queryClient,
}: CreateInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Interest>>(
    `/interests`,
    interest
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTERESTS_QUERY_KEY() });
    SET_INTEREST_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Interest
 */
export const useCreateInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateInterest>>,
      Omit<CreateInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateInterestParams,
    Awaited<ReturnType<typeof CreateInterest>>
  >(CreateInterest, options);
};
