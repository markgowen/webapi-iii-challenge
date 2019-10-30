const express = 'express';

const router = express.Router();

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

router.post('/', validatePost, (req, res) => {
  
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

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {
    
};

module.exports = router;