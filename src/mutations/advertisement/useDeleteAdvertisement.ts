import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ADVERTISEMENTS_QUERY_KEY,
  ADVERTISEMENT_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific advertisement by its ID.
 * This function allows for the removal of an advertisement from the system, ensuring that it is no longer accessible or visible.
 * It is designed to be used in applications where advertisement management is required, providing a mechanism to delete advertisements.
 * @name DeleteAdvertisement
 * @param {string} advertisementId - The ID of the advertisement to delete
 * @version 1.2
 **/
export interface DeleteAdvertisementParams extends MutationParams {
  advertisementId: string;
}

export const DeleteAdvertisement = async ({
  advertisementId,
  adminApiParams,
  queryClient,
}: DeleteAdvertisementParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/advertisements/${advertisementId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ADVERTISEMENTS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: ADVERTISEMENT_QUERY_KEY(advertisementId),
    });
  }
  return data;
};

export const useDeleteAdvertisement = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAdvertisement>>,
      Omit<DeleteAdvertisementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAdvertisementParams,
    Awaited<ReturnType<typeof DeleteAdvertisement>>
  >(DeleteAdvertisement, options, {
    domain: "advertisements",
    type: "del",
  });
};