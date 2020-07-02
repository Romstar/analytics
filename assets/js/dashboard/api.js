import {formatISO} from './date'

let abortController = new AbortController()

function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function cancelAll() {
  abortController.abort()
  abortController = new AbortController()
}

export function serializeQuery(query, extraQuery=[]) {
  query = Object.assign({}, query, {
    date: query.date ? formatISO(query.date) : undefined,
    from: query.from ? formatISO(query.from) : undefined,
    to: query.to ? formatISO(query.to) : undefined,
    filters: query.filters ? JSON.stringify(query.filters) : undefined
  }, ...extraQuery)

  return '?' + serialize(query)
}

export function get(url, query, ...extraQuery) {
  url = url + serializeQuery(query, extraQuery)
  return fetch(url, {signal: abortController.signal})
    .then( response => {
      if (!response.ok) { throw response }
      return response.json()
    })
}
