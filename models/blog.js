'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autopopulate = require('mongoose-autopopulate');
const createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const _Schema = new mongoose.Schema({
    url: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    desc: {type: String, required: true},
    small_desc: {type: String, default: ''},
    cover_img: {type: String, default: ''},
    meta_keywords: [{type: String, default: ''}],
    tags: [{type: String, default: '', is_private: {type: Boolean, default: false}}],
    similar_blog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BLOG',
        autopopulate: {select: 'url title small_desc tags'}
    }],
    is_active: {type: Boolean, default: true}
});

_Schema.plugin(mongoosePaginate);
_Schema.plugin(autopopulate);
_Schema.plugin(createdModified, {index: true});

module.exports = mongoose.model('BLOG', _Schema);
