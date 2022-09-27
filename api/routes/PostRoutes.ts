import express, {Express} from 'express';
import {
  createPost,
  editPost,
  findAllPosts,
  findPostById,
  findPostsByUserId,
  deletePost,
} from '../controller/PostController.js';

const PostRouter: Express = express();

PostRouter.get('/', findAllPosts)
  .get('/user', findPostsByUserId)
  .get('/:id', findPostById)
  .post('/', createPost)
  .put('/', editPost)
  .delete('/', deletePost);

export default PostRouter;
