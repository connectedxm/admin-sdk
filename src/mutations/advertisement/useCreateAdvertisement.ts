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
import { AdvertisementCreateInputs } from "@src/params";

/**
 * Endpoint to create a new advertisement.
 * This function allows the creation of a new advertisement by sending the advertisement data to the server.
 * It is designed to be used in applications where advertisements need to be dynamically created and managed.
 * @name CreateAdvertisement
 * @param {AdvertisementCreateInputs} advertisement - The advertisement data to be created
 * @version 1.2
 **/
export interface CreateAdvertisementParams extends MutationParams {
  advertisement: AdvertisementCreateInputs;
}

export const CreateAdvertisement = async ({
  advertisement,
  adminApiParams,
  queryClient,
}: CreateAdvertisementParams): Promise<ConnectedXMResponse<Advertisement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Advertisement>>(
    `/advertisements`,
    advertisement
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ADVERTISEMENTS_QUERY_KEY() });
    SET_ADVERTISEMENT_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

export const useCreateAdvertisement = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAdvertisement>>,
      Omit<CreateAdvertisementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAdvertisementParams,
    Awaited<ReturnType<typeof CreateAdvertisement>>
  >(CreateAdvertisement, options, {
    domain: "advertisements",
    type: "create",
  });
};