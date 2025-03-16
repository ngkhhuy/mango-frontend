export type MangoType = 'Type 1' | 'Type 2' | 'Extra Class';

export interface Mango {
  source: string;
  ripeness: string;
  origin: any;
  _id?: string;
  id?: string;
  classify: 'Type 1' | 'Type 2' | 'Extra Class';
  weight: number;
  volume: number;
  imageUrl: string;
  createdAt: string | number;
}

export interface MangoStats {
  totalCount: number
  averageWeight: number
  typeDistribution: {
    [key in MangoType]: number
  }
  originDistribution: {
    [key: string]: number
  }
  ripenessDistribution: {
    [key: string]: number
  }
  weightRanges: {
    range: string
    count: number
  }[]
}

