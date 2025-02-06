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
 * Endpoint to update an existing interest with new data.
 * This function allows updating the details of a specific interest identified by its ID.
 * It is used in applications where interest data needs to be modified.
 * @name UpdateInterest
 * @param {string} interestId (path) The ID of the interest to update
 * @param {InterestUpdateInputs} interest (body) The new data for the interest
 * @version 1.3
 **/
export interface UpdateInterestParams extends MutationParams {
  interestId: string;
  interest: InterestUpdateInputs;
}

export const UpdateInterest = async ({
  interestId,
  interest,
  adminApiParams,
  queryClient,
}: UpdateInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  if (!interestId) {
    throw Error("Interest ID Undefined");
  }

  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Interest>>(
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
  >(UpdateInterest, options, {
    domain: "interests",
    type: "update",
  });
};
