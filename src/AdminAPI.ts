import axios, { AxiosInstance } from "axios";

export interface AdminApiParams {
  apiUrl:
    | "https://admin-api.connected.dev"
    | "https://staging-admin-api.connected.dev"
    | "http://localhost:4001";
  organizationId: string;
  getToken?: () => Promise<string | undefined> | string | undefined;
  apiKey?: string;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
}

/**
 * @category Queries
 */
export const GetAdminAPI = async (
  params: AdminApiParams
): Promise<AxiosInstance> => {
  const token = !!params.getToken && (await params.getToken());
  const executeAs = params.getExecuteAs
    ? await params.getExecuteAs()
    : undefined;

  return axios.create({
    baseURL: params.apiUrl,
    headers: {
      organization: params.organizationId,
      authorization: token,
      "api-key": params.apiKey,
      executeAs: executeAs,
    },
  });
};
