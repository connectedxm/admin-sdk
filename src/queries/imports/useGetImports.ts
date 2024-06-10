import { ConnectedXMResponse } from "@src/interfaces";

import { Import } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

export const IMPORTS_QUERY_KEY = () => ["IMPORTS"];

interface GetImportsProps extends InfiniteQueryParams {}

export const GetImports = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetImportsProps): Promise<ConnectedXMResponse<Import[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/imports`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetImports = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetImports>>>(
    IMPORTS_QUERY_KEY(),
    (params: any) => GetImports({ ...params }),
    {},
    {}
  );
};

export default useGetImports;
