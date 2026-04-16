import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const userId = req.user._id;

  const filter = { userId };
  if (tag) {
    filter.tag = tag;
  }
  if (search) {
    filter.$text = { $search: search };
  }

  try {
    const notesPromise = Note.find(filter)
      .skip(skip)
      .limit(parseInt(perPage))
      .exec();

    const countPromise = Note.countDocuments(filter);

    const [notes, totalNotes] = await Promise.all([notesPromise, countPromise]);
    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page: parseInt(page),
      perPage: parseInt(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const note = await Note.create({ ...req.body, userId });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
