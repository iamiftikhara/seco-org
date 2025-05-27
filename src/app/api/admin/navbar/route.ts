import { navbarData } from '@/data/navbar';
import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';


const getNavbarData = async () => {
  try {
    return NextResponse.json({ 
      success: true, 
      data: navbarData 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch navbar data' 
      },
      { status: 500 }
    );
  }
}

const updateNavbarData = async(request: Request) => {
  try {
    const data = await request.json();

    
    // Validate the incoming data structure
    if (!data.logo || !data.logoTitle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid data structure' 
        },
        { status: 400 }
      );
    }

    // In a real application, you would update the data in a database
    navbarData.logo = data.logo;
    navbarData.logoTitle = data.logoTitle;
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update navbar data' 
      },
      { status: 500 }
    );
  }
}


// Export the protected routes
export const GET = withAdminAuth(getNavbarData);
export const PUT = withAdminAuth(updateNavbarData);