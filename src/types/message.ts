export enum DataType {
  string = 'STRING',
  image_url = 'IMAGE_URL'
  // Not sure if there are any more data types we handle right now
}

export type IMessage = {
  role: string;
  content: IContent[];
};

export type IContent = {
  data_type: DataType;
  value: string;
};
