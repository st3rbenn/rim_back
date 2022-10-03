import {Request, Response} from 'express';
import {createRelationsBetweenUserAndPost} from '../services/relations/UserPostServices.js';
import {Post} from '../models/PostModel.js';
import {UserPostLinks} from '../models/UserPostLinksModel.js';
import {User} from '../models/UserModel.js';
import { Op } from 'sequelize';

export const findAllPosts = async (req: Request, res: Response) => {
  let canAllPostsBeFound = true;
  try {
    const posts = await Post.findAll();

    if (!posts) {
      res.status(400).json({
        message: 'No posts found',
      });
      canAllPostsBeFound = false;
    }

    if (canAllPostsBeFound) {
      res.status(200).json({
        message: 'Posts retrieved successfully',
        posts,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
      error,
    });
    throw error;
  }
};

export const findPostById = async (req: Request, res: Response) => {
  let canFindPostById = true;
  try {
    const {id} = req.params;

    if (!id) {
      res.status(400).json({
        message: `Missing parameters : post id`,
      });
      canFindPostById = false;
    }

    const post = await Post.findOne({
      where: {
        id: id,
      },
    });

    if (!post) {
      res.status(400).json({
        message: `No post found with this id`,
      });
      canFindPostById = false;
    }

    if (canFindPostById) {
      res.status(200).json({
        message: 'Post retrieved successfully',
        post,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving post',
      error,
    });
    throw error;
  }
};

export const findPostsByUserId = async (req: Request, res: Response) => {
  let canFindPostByUserId = true;
  const allPosts: any = [];
  try {
    const {id} = req.params;

    if (!id) {
      canFindPostByUserId = false;
      return res.status(400).json({
        message: `Missing parameters : user id`,
      });
    }

    const posts = await UserPostLinks.findAll({
      where: {
        userId: id,
      },
    });

    if (!posts) {
      canFindPostByUserId = false;
      return res.status(400).json({
        message: `No posts found for this user`,
      });
    }

    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'email', 'biography', 'role'],
      },
    });

    if (canFindPostByUserId) {
      for (const post of posts) {
        const postFound = await Post.findOne({
          where: {
            id: Object(post).dataValues.postId,
          },
        });
        allPosts.push(postFound);
      }

      allPosts.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      console.log('tout les posts : ', allPosts);

      res.status(200).json({
        message: 'Posts retrieved successfully',
        user: user,
        posts: allPosts,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
      error,
    });
    throw error;
  }
};

export const createPost = async (req: Request, res: Response) => {
  let canCreatePost = true;
  try {
    const reqBody = {
      content: req.body.content,
      userId: req.body.userId,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canCreatePost = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    if (canCreatePost) {
      const post = await Post.create({
        content: reqBody.content,
      });

      await createRelationsBetweenUserAndPost(reqBody.userId, Object(post).id);

      res.status(200).json({
        message: 'Post created successfully',
        post,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error creating post',
      error,
    });
    throw error;
  }
};

export const editPost = async (req: Request, res: Response) => {
  let canEditPost = true;
  try {
    const reqBody = {
      content: req.body.content,
      postId: req.body.postId,
      userId: req.body.userId,
    };
    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canEditPost = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    const post = await UserPostLinks.findOne({
      where: {
        userId: reqBody.userId,
        postId: reqBody.postId,
      },
    });

    if (!post) {
      canEditPost = false;
      return res.status(400).json({
        message: `No post found for this user and this post id`,
      });
    }

    if (canEditPost) {
      const postUpdated = await Post.update(
        {
          content: reqBody.content,
        },
        {
          where: {
            id: reqBody.postId,
          },
        },
      );

      res.status(200).json({
        message: 'Post updated successfully',
        postUpdated,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error editing post',
      error,
    });
    throw error;
  }
};

export const deletePost = async (req: Request, res: Response) => {
  let canDeletePost = true;
  try {
    const reqBody = {
      postId: req.body.postId,
      userId: req.body.userId,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canDeletePost = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    const posts = await UserPostLinks.findOne({
      where: {
        userId: reqBody.userId,
        postId: reqBody.postId,
      },
    });

    if (!posts) {
      canDeletePost = false;
      return res.status(400).json({
        message: `No post found for this user and this post id`,
      });
    }

    if (canDeletePost) {
      await UserPostLinks.destroy({
        where: {
          userId: reqBody.userId,
          postId: reqBody.postId,
        },
      });

      await Post.destroy({
        where: {
          id: reqBody.postId,
        },
      });

      res.status(200).json({
        message: 'Post deleted successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting post',
      error,
    });
    throw error;
  }
};
