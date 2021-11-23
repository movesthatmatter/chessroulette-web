export type OfficialLichessBroadcastType = {
  tour: {
    description: string;
    id: string;
    markup: string;
    name: string;
    slug: string;
    url: string;
  };
  rounds: Array<{
    id: string;
    name: string;
    slug: string;
    startsAt: number;
    url: string;
  }>;
};
