import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Interest, ConnectedXMResponse } from "@src/interfaces";
import { SET_INTEREST_QUERY_DATA, INTERESTS_QUERY_KEY } from "@src/queries";
import { InterestUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Interest
 */
export interface UpdateInterestParams extends MutationParams {
  interestId: string;
  interest: InterestUpdateInputs;
}

/**
 * @category Methods
 * @group Interest
 */
export const UpdateInterest = async ({
  interestId,
  interest,
  adminApiParams,
  queryClient,
}: UpdateInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  if (!interestId) {
    throw Error("Interest ID Undefined");
  }

  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Interest>>(
    `/interests/${interestId}`,
    {
      ...interest,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_INTEREST_QUERY_DATA(queryClient, [interestId || data.data?.id], data);
    queryClient.invalidateQueries({ queryKey: INTERESTS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Interest
 */
export const useUpdateInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateInterest>>,
      Omit<UpdateInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateInterestParams,
    Awaited<ReturnType<typeof UpdateInterest>>
  >(UpdateInterest, options);
};
