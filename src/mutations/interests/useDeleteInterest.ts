import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { INTERESTS_QUERY_KEY, INTEREST_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific interest by its ID.
 * This function allows for the removal of an interest from the system, ensuring that associated queries are invalidated and removed.
 * It is designed to be used in applications where managing user or system interests is required.
 * @name DeleteInterest
 * @param {string} interestId (path) The ID of the interest to be deleted
 * @version 1.3
 **/

export interface DeleteInterestParams extends MutationParams {
  interestId: string;
}

export const DeleteInterest = async ({
  interestId,
  adminApiParams,
  queryClient,
}: DeleteInterestParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/interests/${interestId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INTERESTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: INTEREST_QUERY_KEY(interestId) });
  }
  return data;
};

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
  >(DeleteInterest, options, {
    domain: "interests",
    type: "del",
  });
};
