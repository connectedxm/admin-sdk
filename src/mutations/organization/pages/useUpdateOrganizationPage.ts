import { GetAdminAPI } from "@src/AdminAPI";
import { PageType, Page, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { OrganizationPageUpdateInputs } from "@src/params";
import { SET_ORGANIZATION_PAGE_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to update a specific organization page with new inputs.
 * This function allows for updating the details of an organization page by specifying the page type and the new inputs.
 * It is designed to be used in applications where organization page details need to be modified.
 * @name UpdateOrganizationPage
 * @param {PageType} type - The type of the page
 * @param {OrganizationPageUpdateInputs} page - The inputs for updating the organization page
 * @version 1.2
 **/

export interface UpdateOrganizationPageParams extends MutationParams {
  type: PageType;
  page: OrganizationPageUpdateInputs;
}

export const UpdateOrganizationPage = async ({
  type,
  page,
  adminApiParams,
  queryClient,
}: UpdateOrganizationPageParams): Promise<ConnectedXMResponse<Page>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Page>>(
    `/organization/pages/${type}`,
    page
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_PAGE_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

export const useUpdateOrganizationPage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationPage>>,
      Omit<UpdateOrganizationPageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationPageParams,
    Awaited<ReturnType<typeof UpdateOrganizationPage>>
  >(UpdateOrganizationPage, options, {
    domain: "org",
    type: "update",
  });
};