import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ADVERTISEMENTS_QUERY_KEY,
  ADVERTISEMENT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Advertisement
 */
export interface DeleteAdvertisementParams extends MutationParams {
  advertisementId: string;
}

/**
 * @category Methods
 * @group Advertisement
 */
export const DeleteAdvertisement = async ({
  advertisementId,
  adminApiParams,
  queryClient,
}: DeleteAdvertisementParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete(
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
/**
 * @category Mutations
 * @group Advertisements
 */
export const useDeleteAdvertisement = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteAdvertisement>>,
      Omit<DeleteAdvertisementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAdvertisementParams,
    Awaited<ReturnType<typeof DeleteAdvertisement>>
  >(DeleteAdvertisement, options);
};
