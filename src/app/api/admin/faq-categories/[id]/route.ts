import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQCategory from '@/models/FAQCategory';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

interface Params {
  id: string;
}

// GET a single FAQ Category
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  // This could be public if needed, but for admin consistency:
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid category ID format' }, { status: 400 });
  }

  try {
    const category = await FAQCategory.findById(id);
    if (!category) {
      return NextResponse.json({ message: 'FAQ Category not found' }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching FAQ category by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// PUT (update) an FAQ Category
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid category ID format' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, description, slug } = body;

    if (!name && !description && !slug) {
        return NextResponse.json({ message: 'At least one field (name, description, or slug) must be provided for update.' }, { status: 400 });
    }
    
    // Find the category first to ensure it exists
    const categoryToUpdate = await FAQCategory.findById(id);
    if (!categoryToUpdate) {
        return NextResponse.json({ message: 'FAQ Category not found' }, { status: 404 });
    }

    // Update fields if provided
    if (name) categoryToUpdate.name = name;
    if (description) categoryToUpdate.description = description;
    if (slug) categoryToUpdate.slug = slug;
    // The pre-save hook will auto-update slug if name changes and slug isn't explicitly provided

    const updatedCategory = await categoryToUpdate.save();

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error: any) {
    console.error('Error updating FAQ category:', error);
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ message: 'A category with this name or slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// DELETE an FAQ Category
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid category ID format' }, { status: 400 });
  }

  try {
    // TODO: Consider implications for FAQEntries that belong to this category.
    // Option 1: Prevent deletion if entries exist.
    // Option 2: Set category to null for associated entries.
    // Option 3: Delete associated entries (cascade - be careful).
    // For now, simple deletion. Add check for associated entries later if needed.

    const deletedCategory = await FAQCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ message: 'FAQ Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'FAQ Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting FAQ category:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}