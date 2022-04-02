import { transform } from 'lodash';
import { parse, ParsedQuery, stringify } from 'query-string';

export const getParsedParams = (search: string) => {
  return search ? parse(search[0] === '?' ? search.slice(1) : search, { sort: false }) : {};
};

export function toQuery(search?: string) {
  return search ? parse(search.slice(1), { sort: false }) : {};
}

export function fromQuery(query: Record<string, any>) {
  const encodedQuery = encodeQuery(query, (value) => encodeURIComponent(value).replace(/%3A/g, ':'));
  return stringify(encodedQuery, { sort: false, encode: false });
}

/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
export function encodeUriQuery(val: string, pctEncodeSpaces = false) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
}

export const encodeQuery = (
  query: ParsedQuery,
  encodeFunction: (val: string, pctEncodeSpaces?: boolean) => string = encodeUriQuery,
) =>
  transform(query, (result: any, value, key) => {
    if (key) {
      const singleValue = Array.isArray(value) ? value.join(',') : value;

      result[key] = encodeFunction(singleValue === undefined || singleValue === null ? '' : singleValue, true);
    }
  });
