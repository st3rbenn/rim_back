export default async function noParamsFounds(param: string | object): Promise<string> {
  if (typeof param === 'string') {
    if (!param) {
      return param;
    }
  }

  if (typeof param === 'object') {
    for (const [key, value] of Object.entries(param)) {
      console.log(key);
      if (!value) {
        return key;
      }
    }
  }
  return 'ok';
}
