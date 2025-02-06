import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Interest, ConnectedXMResponse } from "@src/interfaces";
import { INTERESTS_QUERY_KEY, SET_INTEREST_QUERY_DATA } from "@src/queries";
import { InterestCreateInputs } from "@src/params";

/**
 * Endpoint to create a new interest within the system.
 * This function allows for the creation of a new interest by providing the necessary interest data.
 * It is designed to be used in applications where users can manage and add new interests.
 * @name CreateInterest
 * @param {InterestCreateInputs} interest (body) - The interest data to be created
 * @version 1.3
 **/
export interface CreateInterestParams extends MutationParams {
  interest: InterestCreateInputs;
}

export const CreateInterest = async ({
  interest,
  adminApiParams,
  queryClient,
}: CreateInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Interest>>(
    `/interests`,
    interest
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTERESTS_QUERY_KEY() });
    SET_INTEREST_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

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
  >(CreateInterest, options, {
    domain: "interests",
    type: "create",
  });
};