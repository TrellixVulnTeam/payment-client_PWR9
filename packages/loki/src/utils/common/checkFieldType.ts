// eslint-disable-next-line import/no-anonymous-default-export
export default (data: object, field: string, type: string): boolean =>
  // eslint-disable-next-line valid-typeof
  data?.[field] && typeof data[field] === type
