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
 * @category Params
 * @group Advertisement
 */
export interface CreateAdvertisementParams extends MutationParams {
  advertisement: AdvertisementCreateInputs;
}
/**
 * @category Methods
 * @group Advertisement
 */
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

/**
 * @category Mutations
 * @group Advertisements
 */
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
