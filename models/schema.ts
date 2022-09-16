import { Request } from 'express';
/**
 Schema Generated with mysql-schema-ts 1.9.0
*/

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = Array<JSONValue>

/**
 * Exposes all fields present in conversation as a typescript
 * interface.
 */
export interface Conversation {
  id: number
  message_id: number
  user_id: number
  created_at: Date
  updated_at: Date
}

/**
 * Exposes the same fields as Conversation,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ConversationWithDefaults {
  id: number
  message_id: number
  user_id: number
  created_at: Date
  updated_at: Date
}
/**
 * Exposes all fields present in conversation_message_links as a typescript
 * interface.
 */
export interface ConversationMessageLinks {
  conversation_id: number
  message_id: number
}

/**
 * Exposes the same fields as ConversationMessageLinks,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ConversationMessageLinksWithDefaults {
  conversation_id: number
  message_id: number
}
/**
 * Exposes all fields present in message as a typescript
 * interface.
 */
export interface Message {
  id: number
  message: string
  created_at: Date
  updated_at: Date
}

/**
 * Exposes the same fields as Message,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface MessageWithDefaults {
  id: number
  message: string
  created_at: Date
  updated_at: Date
}
/**
 * Exposes all fields present in post as a typescript
 * interface.
 */
export interface Post {
  id: number
  description: string
  created_at: Date
  updated_at: Date
}

/**
 * Exposes the same fields as Post,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PostWithDefaults {
  id: number
  description: string
  created_at: Date
  updated_at: Date
}
/**
 * Exposes all fields present in user as a typescript
 * interface.
 */
export interface User {
  id: number
  mail: string
  password: string
  username: string
  gender: string
  avatar: string
  role: JSONValue
  created_at: Date
  updated_at: Date
}

/**
 * Exposes the same fields as User,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface UserWithDefaults {
  id: number
  mail: string
  password: string
  username: string
  gender: string
  avatar: string
  role: JSONValue
  created_at: Date
  updated_at: Date
}
/**
 * Exposes all fields present in user_conversation_links as a typescript
 * interface.
 */
export interface UserConversationLinks {
  user_id: number
  conversation_id: number
}

/**
 * Exposes the same fields as UserConversationLinks,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface UserConversationLinksWithDefaults {
  user_id: number
  conversation_id: number
}
/**
 * Exposes all fields present in user_post_links as a typescript
 * interface.
 */
export interface UserPostLinks {
  user_id: number
  post_id: number
}

/**
 * Exposes the same fields as UserPostLinks,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface UserPostLinksWithDefaults {
  user_id: number
  post_id: number
}

export interface GetUserReq extends Request<{ id: User['id'] }> {}