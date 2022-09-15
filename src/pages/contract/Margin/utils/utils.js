export function getManHost() {
  const result = `${window.location.protocol}//${window.location.host}`;
  return result;
}

export default getManHost;
