import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQEntry from '@/models/FAQEntry';
import FAQCategory from '@/models/FAQCategory'; // To validate category existence on update
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

interface Params {
  id: string;
}

// GET a single FAQ Entry (for admin)
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid entry ID format' }, { status: 400 });
  }

  try {
    const entry = await FAQEntry.findById(id).populate('category', 'name slug _id');
    if (!entry) {
      return NextResponse.json({ message: 'FAQ Entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching FAQ entry by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// PUT (update) an FAQ Entry
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid entry ID format' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { question, answer, category: categoryId, isPublished, slug } = body;

    // Find the entry first
    const entryToUpdate = await FAQEntry.findById(id);
    if (!entryToUpdate) {
        return NextResponse.json({ message: 'FAQ Entry not found' }, { status: 404 });
    }

    // Validate category if provided
    if (categoryId) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: 'Invalid category ID format for update.' }, { status: 400 });
        }
        const categoryExists = await FAQCategory.findById(categoryId);
        if (!categoryExists) {
            return NextResponse.json({ message: 'Referenced FAQ Category not found for update.' }, { status: 404 });
        }
        entryToUpdate.category = new mongoose.Types.ObjectId(categoryId);
    }

    // Update fields
    if (question) entryToUpdate.question = question;
    if (answer) entryToUpdate.answer = answer;
    if (isPublished !== undefined) entryToUpdate.isPublished = isPublished;
    if (slug) entryToUpdate.slug = slug;
    // Pre-save hook will handle slug generation if question changes and slug isn't explicitly set

    const updatedEntry = await entryToUpdate.save();
    return NextResponse.json(updatedEntry, { status: 200 });

  } catch (error: any) {
    console.error('Error updating FAQ entry:', error);
    if (error.code === 11000) { // Duplicate key error (likely for slug)
      return NextResponse.json({ message: 'An FAQ entry with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// DELETE an FAQ Entry
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid entry ID format' }, { status: 400 });
  }

  try {
    const deletedEntry = await FAQEntry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return NextResponse.json({ message: 'FAQ Entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'FAQ Entry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting FAQ entry:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}