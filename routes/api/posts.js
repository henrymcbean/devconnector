const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile Model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (!posts) {
        res.status(404).json({ nopostsfound: 'No posts found with that ID' })
      }
      res.json(posts)
    })
    .catch(err => res.status(404));
});

// @route   GET api/posts/:id
// @desc    Get post
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(404).json({ nopostfound: 'No post found with that ID' })
      }
      res.json(post)
    })
    .catch(err => res.status(404));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get Fields
  const NewPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  })

  NewPost.save()
    .then(post => res.json(post))
    .catch(err => console.log(err));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
          }

          if (post.user.toString() !== req.user.id) {
            res.status(401).json({ notauthorised: 'User not authorised' })
          }

          // Delete
          post.remove().then(() => res.json({ Success: true }))
            .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
    })
});

// @route   POST api/posts/like/:id
// @desc    Create like
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
          }

          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'user already liked this post' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          // Save post
          post.save().
            then(post => res.json(post))
            .catch(err => console.log(err));
        })
        .catch(err => res.status(400).json({ postnotfound: 'No post found' }));
    })
});

// @route   Delete api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.delete('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
          }

          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this post' });
          }

          // Get index by mapping through
          const removeindex = post.likes.map(item => item.user.id.toString()).indexOf(req.user.id);

          // Splice out of Array
          post.likes.splice(removeindex, 1);

          // Save post
          return post.save()
            .then(post => res.json(post))
            .catch(err => console.log(err));

        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// @route   POST api/posts/comments/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body); // Reused validation for post, only has text.

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findById(req.user.id)
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
          }

          const newComment = {
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id
          };

          // Add comment to array
          post.comments.unshift(newComment);

          // Save comment
          post.save()
            .then(post => res.json(post))
            .catch(err => console.log(err));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// @route   DELETE api/posts/comments/:id
// @desc    Delete comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findById(req.user.id)
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
          }

          // Check if Comment exist
          if (post.comments.map(item => item.id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({ commentnotexist: 'Comment does not exist' });
          }

          // Get remove Index
          const removeIndex = post.comments.reduce(function (curr, val, index) {
            if (val.user.toString() === req.user.id && val.id.toString() === req.params.comment_id) {
              return index;
            }
            return curr;
          }, -1);

          // Check index exist 
          if (removeIndex === -1) {
            return res.status(404).json({ postcommentnotfound: 'No post comment found' });
          }

          // Remove comment to array
          post.comments.splice(removeIndex, 1);

          // Save comment
          post.save()
            .then(post => res.json(post))
            .catch(err => console.log(err));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

module.exports = router;
