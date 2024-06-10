import { GetAdminAPI } from '@src/AdminAPI';
import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";

export const CHANNEL_KPI_CONTENTS_QUERY_KEY = (channelId: string) => [
  ...CHANNEL_QUERY_KEY(channelId),
  "KPI_CONTENTS",
];

export const SET_CHANNEL_KPI_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_KPI_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelKPIContents>>
) => {
  client.setQueryData(
    CHANNEL_KPI_CONTENTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelKPIContentsProps {
  channelId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetChannelKPIContents = async ({
  channelId,
}: GetChannelKPIContentsProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/kpi/contents`
  );
  return data;
};

const useGetChannelKPIContents = (channelId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelKPIContents>>((
    CHANNEL_KPI_CONTENTS_QUERY_KEY(channelId),
    () => GetChannelKPIContents({ channelId }),
    {
      enabled: !!channelId,
    }
  );
};

export default useGetChannelKPIContents;
