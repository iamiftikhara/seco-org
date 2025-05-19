import { NextResponse } from 'next/server';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');

    // Create images directory if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const files = fs.readdirSync(imagesDir);
    
    // Get files with their stats for sorting
    const filesWithStats = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        return {
          file,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      });

    // Sort files by creation date, newest first
    filesWithStats.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

    // Map to image paths
    const images = filesWithStats.map(file => `/images/${file.file}`);

    return NextResponse.json({
      success: true,
      images
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch images'
    }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded'
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');

    // Ensure images directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Clean the filename and get extension
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);

    // Check if file exists and generate unique name if needed
    let finalFilename = originalName;
    let counter = 1;
    
    while (fs.existsSync(path.join(imagesDir, finalFilename))) {
      finalFilename = `${nameWithoutExt}-${counter}${ext}`;
      counter++;
    }

    const filepath = path.join(imagesDir, finalFilename);

    // Write file
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      path: `/images/${finalFilename}`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image'
    }, { status: 500 });
  }
}


// Rename an image

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { oldName, newName } = body;

    // Validate file names
    if (!oldName || !newName) {
      return NextResponse.json({
        success: false,
        error: 'Both oldName and newName are required'
      }, { status: 400 });
    }

    // Clean the filenames and validate extensions
    const cleanOldName = oldName.replace(/[^a-zA-Z0-9.-]/g, '');
    const cleanNewName = newName.replace(/[^a-zA-Z0-9.-]/g, '');
    
    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(cleanNewName)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file extension'
      }, { status: 400 });
    }

    // Get file paths
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    const oldPath = path.join(imagesDir, cleanOldName);
    const newPath = path.join(imagesDir, cleanNewName);

    // Check if source file exists
    if (!fs.existsSync(oldPath)) {
      return NextResponse.json({
        success: false,
        error: 'Source image not found'
      }, { status: 404 });
    }

    // Check if destination file already exists
    if (fs.existsSync(newPath)) {
      return NextResponse.json({
        success: false,
        error: 'A file with the new name already exists'
      }, { status: 409 });
    }

    // Rename the file
    fs.renameSync(oldPath, newPath);

    return NextResponse.json({ 
      success: true,
      message: 'Image renamed successfully',
      oldPath: `/images/${cleanOldName}`,
      newPath: `/images/${cleanNewName}`
    });
  } catch (error) {
    console.error('Error renaming image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to rename image' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { path: imagePath } = await request.json();
    
    if (!imagePath) {
      return NextResponse.json({
        success: false,
        error: 'No image path provided'
      }, { status: 400 });
    }

    const filename = imagePath.split('/').pop();
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    const filepath = path.join(imagesDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }

    // Delete file
    fs.unlinkSync(filepath);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete image'
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};