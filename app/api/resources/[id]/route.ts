import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resource = await (prisma as any).resource.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error deleting resource:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const grade = formData.get("grade") as string;
    const type = formData.get("type") as string;
    const file = formData.get("file") as File | null;

    let updateData: any = {
      title,
      description,
      subject,
      grade,
      type,
    };

    // If a new file is uploaded, handle it
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      // Upload new file
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(fileName);

      updateData.file_url = publicUrl;
    }

    // Update resource record
    const { data, error } = await supabase
      .from('resources')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating resource:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 