const express = 'express';

const router = express.Router();

router.post('/', validatePost, validateUser, (req, res) => {
  const post = req.body;
  console.log('post', post);

  db.insert(post)
    .then(postID => {
      console.log(postID.id);
      db.findById(postID.id).then(post => {
        res.status(201).json(post);
      });
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

router.post('/:id/posts', (req, res) => {
  const comment = { ...req.body, postID: req.params.id };
  console.log('comment', comment);

  db.findById(comment.postID)
    .then(post => {
      if (!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        });
      }

      db.insertComment(comment).then(postID => {
        console.log(postID.id);
        res.status(201).json(comment);
      });
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({
        error: 'There was an error while saving the comment to the database'
      });
    });
});

router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: 'The user information could not be retrieved.'
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The user information could not be retrieved.' });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const userID = req.params.id;

  db.getUserPosts(userId)
    .then(posts => {
      db.findById(userID).then(userID => {
        console.log(userID);
        if (userID.length) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
        }
      });
    })
    .catch(err => {
      console.log('error', err);
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(count => {
      if (!count) {
        res.status(404).json({
          message: `The user with the specified ID ${id} does not exist.`
        });
        return;
      }
      res.status(200).json({ message: 'Successfully deleted user' });
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({ error: 'The user could not be removed' });
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  db.update(id, changes)
    .then(users => {
      if (!user) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
        return;
      }
      db.findById(id).then(users => {
        res.status(200).json(users);
      });
    })
    .catch(err => {
      console.log('error', err);
      res
        .status(500)
        .json({ error: 'The user information could not be modified.' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  if (req.params.id) {
    return;
  } else {
    res.status(404).json({ message: 'invalid user id' });
  }
  next();
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: 'missing user data' });
    return;
  }

  if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' });
  }
  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: 'missing post data' });
    return;
  }

  if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  }
  next();
}

module.exports = router;
