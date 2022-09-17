import { UserPostLinks } from './../models/UserPostLinksModel';
import sequelize from '../database/Connection.js';
import { Request, Response } from 'express';
import { createRelationsBetweenUserAndPost } from '../services/relations/UserPostServices.js';

export const findAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await sequelize.models.Post.findAll();
    res.status(200).json({
      message: 'Posts retrieved successfully',
      posts
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
      error
    })
    throw error;
  }
}

export const findPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await sequelize.models.Post.findOne({
      where: {
        id: id
      }
    });
    res.status(200).json({
      message: 'Post retrieved successfully',
      post
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving post',
      error
    })
    throw error;
  }
}

export const findPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const posts = await sequelize.models.UserPostLinks.findAll({
      where: {
        userId: userId
      }
    });
    const allPosts: any = [];
    for (const post of posts) {
      const postFound = await sequelize.models.Post.findOne({
        where: {
          id: Object(post).dataValues.postId
        }
      });
      allPosts.push(postFound);
    }

    res.status(200).json({
      message: 'Posts retrieved successfully',
      allPosts
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
      error
    })
    throw error;
  }
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;
    const post = await sequelize.models.Post.create({
      message
    });

    await createRelationsBetweenUserAndPost(userId, Object(post).id);
    res.status(200).json({
      message: 'Post created successfully',
      post
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error creating post',
      error
    })
    throw error;
  }
}

export const editPost = async (req: Request, res: Response) => {
  try {
    const { message, postId, userId } = req.body;
    const posts = await sequelize.models.UserPostLinks.findAll({
      where: {
        userId: userId,
        postId: postId
      }
    });

    if(Object(posts).length > 0) {
      const post = await sequelize.models.Post.update({
        message
      }, {
        where: {
          id: postId
        }
      });
      res.status(200).json({
        message: 'Post updated successfully',
        post
      })
    } else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error editing post',
      error
    })
    throw error;
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.body;
    const posts = await sequelize.models.UserPostLinks.findAll({
      where: {
        userId: userId,
        postId: postId
      }
    });

    if(Object(posts).length > 0) {
      const post = await sequelize.models.Post.destroy({
        where: {
          id: postId
        }
      });
      res.status(200).json({
        message: 'Post deleted successfully',
        post
      })
    } else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting post',
      error
    })
    throw error;
  }
}