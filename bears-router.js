const router = require('express').Router();

const knex = require('knex');
const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3',
    },
    // debug: true,
};
const db = knex(knexConfig);

router.post('/', (req,res) => {
    if (!req.body.name) {
        res.status(400).json({error:'missing required field: name'});
    } else {
    db('bears').insert(req.body)
        .then(ids => {
            const id = ids[0];
            db('bears').where({id: id}).first()
                .then(bear => {
                    res.status(201).json(bear);
                });
        })
        .catch(err => res.status(500).json(err));
    }
});

router.get('/', (req,res) => {
    db('bears')
        .then(bear => {
            res.status(200).json(bear);
        })
        .catch(err => res.status(500).json(err));
});

router.get('/:id', (req,res) => {
    db('bears').where({id: req.params.id}).first()
        .then(bear => {
            if (bear) {
                res.status(200).json(bear);
            } else {
                res.status(404).json({error:'Record not found'});
            }
        })
        .catch(err => res.status(500).json(err));
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    if (!req.body.name) {
        res.status(400).json({error:'missing required field: name'});
    } else {
    db('bears').where({ id: id }).update(req.body)
      .then(count => {
        if (count) {
            db('bears').where({id: id}).first()
            .then(bear => {
                res.status(200).json(bear);
            });
        } else {
          res.status(404).json({ error: 'Record not found' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
    }
});

router.delete('/:id', (req,res) => {
    db('bears').where({id: req.params.id}).del()
        .then(count => {
            if (count) {
                res.status(200).json({success: 'Record deleted'});
            } else {
                res.status(404).json({error:'Record not found'});
            }
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;