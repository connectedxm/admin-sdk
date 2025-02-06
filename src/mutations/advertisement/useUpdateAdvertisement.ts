import { Advertisement, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ADVERTISEMENTS_QUERY_KEY,
  SET_ADVERTISEMENT_QUERY_DATA,
} from "@src/queries";
import { AdvertisementUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing advertisement with new details.
 * This function allows users to modify the details of an advertisement by providing the advertisement ID and the updated inputs.
 * It ensures that the advertisement data is updated in the system and invalidates the relevant queries to refresh the data.
 * @name UpdateAdvertisement
 * @param {string} advertisementId (path) - The ID of the advertisement
 * @param {AdvertisementUpdateInputs} advertisement (body) - The advertisement update inputs
 * @version 1.3
 **/
export interface UpdateAdvertisementParams extends MutationParams {
  advertisementId: string;
  advertisement: AdvertisementUpdateInputs;
}

export const UpdateAdvertisement = async ({
  advertisementId,
  advertisement,
  adminApiParams,
  queryClient,
}: UpdateAdvertisementParams): Promise<ConnectedXMResponse<Advertisement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Advertisement>>(
    `/advertisements/${advertisementId}`,
    advertisement
  );

  if (queryClient && data.status === "ok") {
    SET_ADVERTISEMENT_QUERY_DATA(queryClient, [advertisementId], data);
    queryClient.invalidateQueries({ queryKey: ADVERTISEMENTS_QUERY_KEY() });
  }

  return data;
};

export const useUpdateAdvertisement = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAdvertisement>>,
      Omit<UpdateAdvertisementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAdvertisementParams,
    Awaited<ReturnType<typeof UpdateAdvertisement>>
  >(UpdateAdvertisement, options, {
    domain: "advertisements",
    type: "update",
  });
};