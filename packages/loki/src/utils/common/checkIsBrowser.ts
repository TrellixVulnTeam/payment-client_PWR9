// eslint-disable-next-line import/no-anonymous-default-export
export default (isIncludeJest = false) => {
  const isRunOnNode = typeof process !== 'undefined' && typeof process.versions.node !== 'undefined';
  const isRunOnBrowser = typeof window === 'object';
  if (isIncludeJest) {
    return isRunOnBrowser;
  }
  if (!isIncludeJest && !isRunOnNode) {
    return true;
  }
  return false;
};
