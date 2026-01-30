import { Advertisement, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ADVERTISEMENTS_QUERY_KEY,
  SET_ADVERTISEMENT_QUERY_DATA,
} from "@src/queries";
import { AdvertisementUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Advertisement
 */
export interface UpdateAdvertisementParams extends MutationParams {
  advertisementId: string;
  advertisement: AdvertisementUpdateInputs;
}

/**
 * @category Methods
 * @group Advertisement
 */
export const UpdateAdvertisement = async ({
  advertisementId,
  advertisement,
  adminApiParams,
  queryClient,
}: UpdateAdvertisementParams): Promise<ConnectedXMResponse<Advertisement>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Advertisement>>(
    `/advertisements/${advertisementId}`,
    advertisement
  );

  if (queryClient && data.status === "ok") {
    SET_ADVERTISEMENT_QUERY_DATA(queryClient, [advertisementId], data);
    queryClient.invalidateQueries({ queryKey: ADVERTISEMENTS_QUERY_KEY() });
  }

  return data;
};

/**
 * @category Mutations
 * @group Advertisements
 */
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
  >(UpdateAdvertisement, options);
};
