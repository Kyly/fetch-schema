# fetch-schema
Converts a GraphQL introspection query response to schema definition language (SDL).

Simple utility to performs a schema request to a given GraphQL endpoint.

## Install
`npm i fetch-schema -g`

## Usage
`fetch-schema [options] <url>`

`<url>` (required) must be a valid graphql endpoint that support introspection.   

## Options
- `-f --fileName <fileName>` (optional) the file name to write the schema to. If not provided schema will be written
to the console. 
- `-p --password <password>` (optional) password for basic auth. If not provided no authentication is used.
- `-u --user <userName>`     (optional) user name used for basic auth. If not provided no authentication is used.
- `-h --help`                Show help message.

## Example
This example uses the real [Snowtooth API](https://snowtooth.moonhighway.com/) for a fake ski resort.

```
fetch-schema https://snowtooth.moonhighway.com/ -f snowtooth.graphql -d

 GraphQL Endpoint: https://snowtooth.moonhighway.com/ 

✔ Done fetching schema!
✔ Done writing schema to snowtooth.graphql!
```

And the output file _snowtooth.graphql_ contains:
```graphql
directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT | INTERFACE

type Query {
  allLifts(status: LiftStatus): [Lift!]!
  allTrails(status: TrailStatus): [Trail!]!
  Lift(id: ID!): Lift!
  Trail(id: ID!): Trail!
  liftCount(status: LiftStatus): Int!
  trailCount(status: TrailStatus): Int!
  gnar: String!
  sweet: String!
}

enum LiftStatus {
  OPEN
  CLOSED
  HOLD
}

type Lift {
  id: ID!
  name: String!
  status: LiftStatus
  capacity: Int!
  night: Boolean!
  elevationGain: Int!
  trailAccess: [Trail!]!
}

type Trail {
  id: ID!
  name: String!
  status: TrailStatus
  difficulty: String!
  groomed: Boolean!
  trees: Boolean!
  night: Boolean!
  accessedByLifts: [Lift!]!
}

enum TrailStatus {
  OPEN
  CLOSED
}

type Mutation {
  setLiftStatus(id: ID!, status: LiftStatus!): Lift!
  setTrailStatus(id: ID!, status: TrailStatus!): Trail!
}

type Subscription {
  liftStatusChange: Lift
  trailStatusChange: Trail
}

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

scalar Upload
```
## API
### fetchSchema ⇒ `Promise<string>`
Fetches schema sdl from and endpoint using introspection.
 
 | Param | Type | Description |
 | --- | --- | --- |
 | requestConfig | `{url: string, config: object?}` | url is the graphql endpoint you wish to use. Config is passed to the Axios client (AxiosRequestConfig). |
 | queryOptions | `{descriptions: boolean?}?` | options used for generating query. |
 

```javascript
import fetchSchema from 'fetch-schema';

fetchSchema({ url: 'https://snowtooth.moonhighway.com/' })
    .then(sdl => console.log(sdl))
    .catch(error => console.error(error));
```

## Enhancements
Thing that could probably make this better.

- More authentication option.
- JSON to schema sdl.
- Choose only a part of an API.