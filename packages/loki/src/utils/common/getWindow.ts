// eslint-disable-next-line import/no-anonymous-default-export
export default (): Window | undefined => (typeof window === 'undefined' ? undefined : (window as Window));
