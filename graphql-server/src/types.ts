export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type Hello = {
  __typename?: 'Hello'
  text?: Maybe<Scalars['String']>
}

export type LokiMeta = {
  __typename?: 'LokiMeta'
  revision?: Maybe<Scalars['Int']>
  created?: Maybe<Scalars['Int']>
  version?: Maybe<Scalars['Int']>
  updated?: Maybe<Scalars['Int']>
}

export type Mutation = {
  __typename?: 'Mutation'
  newHello?: Maybe<Hello>
}

export type MutationNewHelloArgs = {
  newHello?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  hello?: Maybe<Hello>
}
